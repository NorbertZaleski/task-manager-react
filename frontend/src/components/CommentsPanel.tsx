import { MessageSquareText } from "lucide-react";
import EditableText from "./EditableText";
import { useNoteActivity } from "../hooks/useNoteActivity";
import type { ActivityLogItem, CommentItem } from "../types/types";
import Avatar from "./Avatar";
import { useState } from "react";
import Button from "./Button";

type CommentsPanelProps = {
  activity: ReturnType<typeof useNoteActivity>;
  currentUserId: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const describeActivity = (a: ActivityLogItem) => {
  const m = a.meta ?? {};
  switch (a.action) {
    case "created":
      return `created this note${m.columnTitle ? ` in ${m.columnTitle}` : ""}`;
    case "renamed":
      return `renamed this note from "${m.from}" to "${m.to}"`;
    case "moved":
      return `moved this note from ${m.from} to ${m.to}`;
    case "label_added":
      return `added label ${m.title || m.color}`;
    case "label_removed":
      return `removed label ${m.title || m.color}`;
    case "due_set":
      return `set the due date to ${new Date(m.dueDate).toLocaleDateString()}`;
    case "due_removed":
      return "removed the due date";
    case "due_completed":
      return "marked the due date as complete";
    case "due_reopened":
      return "marked the due date as incomplete";
    case "completed":
      return "marked this note as complete";
    case "reopened":
      return "marked this note as incomplete";
    default:
      return a.action;
  }
};

function CommentRow({
  comment,
  isOwn,
  onEdit,
  onDelete,
}: {
  comment: CommentItem;
  isOwn: boolean;
  onEdit: (text: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2 text-xs">
        <span><Avatar user={comment.author}/></span>
        <span className="font-semibold">{comment.author?.name ?? "Deleted user"}</span>
        <span className="opacity-60">
          {formatDate(comment.createdAt)}
          {comment.editedAt && " (edited)"}
        </span>
      </div>

      {isOwn ? (
        <EditableText
          value={comment.text}
          onCommit={onEdit}
          editing={editing}
          onEditingChange={setEditing}
          clickToEdit={false}
          multiline
          showActions
          maxLength={2000}
          className="w-full text-sm whitespace-pre-wrap"
          viewClassName="rounded-md px-3 py-2 bg-input"
          editClassName="rounded-md px-3 py-2 outline outline-1 outline-(--border-mute)"
        />
      ) : (
        <p className="rounded-md px-3 py-2 bg-input text-sm whitespace-pre-wrap wrap-break-word">
          {comment.text}
        </p>
      )}

      {isOwn && !editing && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 self-start text-xs opacity-60 hover:opacity-100 cursor-pointer underline"
          >
            Edit
          </button>
          
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 self-start text-xs opacity-60 hover:opacity-100 cursor-pointer underline"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}

function CommentsPanel({ activity, currentUserId }: CommentsPanelProps) {
  const { items, hasMore, error, loadMore, addComment, editComment, removeComment } = activity;
  const [showDetails, setShowDetails] = useState(false);

  const visibleItems = showDetails ? items : items.filter((item) => item.type === "comment");

  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <MessageSquareText size={18} />
          <span className="text-sm font-semibold">Comments and activity</span>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowDetails((v) => !v)}
          aria-pressed={showDetails}
        >
          {showDetails ? "Hide details" : "Show details"}
        </Button>
      </div>

      <div className="w-full mt-6 mb-4">
        <EditableText
          value=""
          placeholder="Write a comment..."
          onCommit={addComment}
          multiline
          showActions
          maxLength={2000}
          className="w-full text-sm whitespace-pre-wrap"
          viewClassName="rounded-md px-3 py-2 bg-input hover:bg-black/10 cursor-pointer hover:shadow-[inset_0_-2px_0_0_var(--bg-input)]"
          editClassName="rounded-md px-3 py-2 outline outline-1"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <ul className="flex flex-col gap-4">
        {visibleItems.map((item) =>
          item.type === "comment" ? (
            <CommentRow
              key={item.id}
              comment={item}
              isOwn={item.author?.id === currentUserId}
              onEdit={(text) => editComment(item.id, text)}
              onDelete={() => removeComment(item.id)}
            />
          ) : (
            <li key={item.id} className="text-xs opacity-70">
              <span className="font-semibold">{item.author?.name ?? "Someone"}</span>{" "}
              {describeActivity(item)}
              <span className="ml-2 opacity-60">{formatDate(item.createdAt)}</span>
            </li>
          )
        )}
      </ul>

      {hasMore && (
        <button type="button" onClick={loadMore} className="mt-4 self-start text-xs underline">
          Show more
        </button>
      )}
    </div>
  );
}

export default CommentsPanel;