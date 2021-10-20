import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
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
import { useColors } from "../../hooks/useColors";
import { usePostUnpublishMutation } from "../../hooks/mutation/usePostUnpublishMutation";
import { usePostPublishMutation } from "../../hooks/mutation/usePostPublishMutation";

interface Props {
  isMyPost: boolean;
  post: Post;
}

export const ActionMenu: React.FC<Props> = ({ isMyPost, post }) => {
  const { secondaryButtonTextColor } = useColors();
  const router = useRouter();
  const { deletePost, isLoading: isDeleting } = usePostDelete(post.id);
  const unpublishMutation = usePostUnpublishMutation(post.id);
  const publishMutation = usePostPublishMutation(post.id);

  const handleEditClick = React.useCallback(() => {
    router.push(`/p/${post.id}/edit`);
  }, [router, post.id]);

  const handleDeletePost = React.useCallback(() => deletePost(), [deletePost]);

  const handleUnpublishPost = React.useCallback(
    () => unpublishMutation.mutate(),
    [unpublishMutation]
  );

  const handlepublishPost = React.useCallback(
    () => publishMutation.mutate(),
    [publishMutation]
  );

  const commonProps = {
    as: IconButton,
    "aria-label": "Options",
    icon: <DotsVerticalIcon width="15" height="15" />,
  } as const;

  const mobileButton = (
    <MenuButton {...commonProps} variant="solid" size="sm" />
  );

  const desktopButton = (
    <MenuButton {...commonProps} variant="ghost" size="xs" />
  );

  const buttonComponent = useBreakpointValue({
    base: mobileButton,
    sm: desktopButton,
  });

  if (!isMyPost) return null;

  return (
    <Menu>
      {buttonComponent}
      <MenuList>
        <MenuItem
          onClick={handleEditClick}
          icon={<PencilAltIcon width="15" height="15" />}
        >
          Edit
        </MenuItem>
        {post.published ? (
          <MenuItem
            onClick={handleUnpublishPost}
            disabled={unpublishMutation.isLoading}
            icon={<CloudDownloadIcon width="15" height="15" />}
          >
            Unpublish
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handlepublishPost}
            disabled={publishMutation.isLoading}
            icon={<CloudUploadIcon width="15" height="15" />}
          >
            Publish
          </MenuItem>
        )}
        <MenuItem
          onClick={handleDeletePost}
          disabled={isDeleting}
          icon={<TrashIcon width="15" height="15" />}
        >
          Remove
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
