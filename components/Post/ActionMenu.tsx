import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import {
  PencilAltIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  TrashIcon,
  DotsVerticalIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Post } from "../../types/Post";
import { usePostDelete } from "../../hooks/usePostDelete";
import { usePostUnpublish } from "../../hooks/usePostUnpublish";
import { usePostPublish } from "../../hooks/usePostPublish";

interface Props {
  isMyPost: boolean;
  post: Post;
}

export const ActionMenu: React.FC<Props> = ({ isMyPost, post }) => {
  const router = useRouter();
  const { deletePost, isLoading: isDeleting } = usePostDelete(post.id);
  const { unpublishPost, isLoading: isUnpublishing } = usePostUnpublish(
    post.id
  );
  const { publishPost, isLoading: isPublishing } = usePostPublish(post.id);

  const handleEditClick = React.useCallback(() => {
    router.push(`/p/${post.id}/edit`);
  }, []);

  const handleDeletePost = React.useCallback(() => deletePost(), [deletePost]);

  const handleUnpublishPost = React.useCallback(
    () => unpublishPost(),
    [unpublishPost]
  );

  const handlepublishPost = React.useCallback(
    () => publishPost(),
    [publishPost]
  );

  if (!isMyPost) return null;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<DotsVerticalIcon width="20" height="20" />}
        variant="ghost"
      />
      <MenuList>
        <MenuItem
          onClick={handleEditClick}
          icon={<PencilAltIcon width="20" height="20" />}
        >
          Edit
        </MenuItem>
        {post.published ? (
          <MenuItem
            onClick={handleUnpublishPost}
            disabled={isUnpublishing}
            icon={<CloudDownloadIcon width="20" height="20" />}
          >
            Unpublish
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handlepublishPost}
            disabled={isPublishing}
            icon={<CloudUploadIcon width="20" height="20" />}
          >
            Publish
          </MenuItem>
        )}
        <MenuItem
          onClick={handleDeletePost}
          disabled={isDeleting}
          icon={<TrashIcon width="20" height="20" />}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const ActionButton = React.forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <IconButton
      ref={ref}
      aria-label="menu icon"
      icon={<DotsVerticalIcon width="20" height="20" />}
      variant="ghost"
      {...props}
    />
  );
});
