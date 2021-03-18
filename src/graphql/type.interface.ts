export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type BasePaginationMeta = {
  __typename?: 'BasePaginationMeta';
  itemCount: Scalars['Float'];
  totalItems: Scalars['Float'];
  itemsPerPage: Scalars['Float'];
  totalPages: Scalars['Float'];
  currentPage: Scalars['Float'];
};

export type User = Node & {
  __typename?: 'User';
  id: Scalars['Float'];
  name: Scalars['String'];
  nickname: Scalars['String'];
  intro: Scalars['String'];
  zaloId: Scalars['String'];
  avatar?: Maybe<Scalars['Float']>;
  isNew: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  avatarFilePath?: Maybe<Scalars['String']>;
  followStatus?: Maybe<FollowStatus>;
  nFollowing?: Maybe<Array<User>>;
  nFollower?: Maybe<Array<User>>;
};

/** Node */
export type Node = {
  id: Scalars['Float'];
};

export type FollowStatus = 'IS_ME' | 'WAITING' | 'ACCEPT';

export type UserConnection = {
  __typename?: 'UserConnection';
  items?: Maybe<Array<User>>;
  meta: BasePaginationMeta;
};

export type Follow = Node & {
  __typename?: 'Follow';
  id: Scalars['Float'];
  creatorId: Scalars['Float'];
  followUser: Scalars['Float'];
  status: FollowStatus;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type Media = Node & {
  __typename?: 'Media';
  id: Scalars['Float'];
  fileSize?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  filePath?: Maybe<Scalars['String']>;
  mimeType?: Maybe<Scalars['String']>;
  isDeleted: Scalars['Boolean'];
  type: FileType;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type FileType = 'FILE' | 'DIR';

export type MediaConnection = {
  __typename?: 'MediaConnection';
  items?: Maybe<Array<Media>>;
  meta: BasePaginationMeta;
};

/** AuthConnection */
export type AuthConnection = {
  __typename?: 'AuthConnection';
  accessToken?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  user: User;
};

export type Post = Node & {
  __typename?: 'Post';
  id: Scalars['Float'];
  creatorId: Scalars['Float'];
  medias?: Maybe<Array<Scalars['Float']>>;
  caption?: Maybe<Scalars['String']>;
  rawCaption?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  postComments?: Maybe<Array<Comments>>;
  totalLike: Scalars['Float'];
  isLike: Scalars['Boolean'];
  mediasPath?: Maybe<Array<Media>>;
  creatorInfo?: Maybe<User>;
};

export type PostConnection = {
  __typename?: 'PostConnection';
  items?: Maybe<Array<Post>>;
  meta: BasePaginationMeta;
};

export type Comments = Node & {
  __typename?: 'Comments';
  id: Scalars['Float'];
  creatorId: Scalars['Float'];
  postId: Scalars['Float'];
  parentId: Scalars['Float'];
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  creatorInfo: User;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  getUserInfo?: Maybe<User>;
  searchUser: UserConnection;
  isAvailable: Scalars['Boolean'];
  medias?: Maybe<MediaConnection>;
  media?: Maybe<Media>;
  getNewFeed: PostConnection;
  getExplorePost: PostConnection;
  getPostDetail: Post;
  myPost: PostConnection;
};

export type QueryGetUserInfoArgs = {
  id: Scalars['Float'];
};

export type QuerySearchUserArgs = {
  page: Scalars['Float'];
  limit: Scalars['Float'];
  isRestricted?: Maybe<Scalars['Boolean']>;
  keyword: Scalars['String'];
};

export type QueryIsAvailableArgs = {
  nickname: Scalars['String'];
};

export type QueryMediasArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  parentId?: Maybe<Scalars['String']>;
};

export type QueryMediaArgs = {
  id: Scalars['Float'];
};

export type QueryGetNewFeedArgs = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type QueryGetExplorePostArgs = {
  page: Scalars['Float'];
  limit: Scalars['Float'];
};

export type QueryGetPostDetailArgs = {
  id: Scalars['Float'];
};

export type QueryMyPostArgs = {
  page: Scalars['Float'];
  limit: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  updateUserInfo: User;
  uploadMedia: Media;
  uploadMediaToS3: Media;
  removeMedia: Media;
  updateMedia: Media;
  createDir: Media;
  FollowUser: Scalars['Boolean'];
  UnFollowUser: Scalars['Boolean'];
  loginWithSNS: AuthConnection;
  logout: Scalars['Boolean'];
  createComment: Comments;
  updateComment: Comments;
  removeComment: Scalars['Boolean'];
  createPost: Post;
  updatePost: Post;
  removePost: Scalars['Boolean'];
  reactToPost: Scalars['Boolean'];
  reportPost: Scalars['Boolean'];
};

export type MutationUpdateUserInfoArgs = {
  input: UpdateUserInput;
};

export type MutationUploadMediaArgs = {
  provider?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['ID']>;
  file: Scalars['Upload'];
};

export type MutationUploadMediaToS3Args = {
  parentId?: Maybe<Scalars['ID']>;
  file: Scalars['Upload'];
};

export type MutationRemoveMediaArgs = {
  id?: Maybe<Scalars['ID']>;
};

export type MutationUpdateMediaArgs = {
  input: UpdateMediaInput;
};

export type MutationCreateDirArgs = {
  parentId?: Maybe<Scalars['ID']>;
  dirName: Scalars['String'];
};

export type MutationFollowUserArgs = {
  id: Scalars['Float'];
};

export type MutationUnFollowUserArgs = {
  id: Scalars['Float'];
};

export type MutationLoginWithSnsArgs = {
  input: NewUserInput;
};

export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};

export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};

export type MutationRemoveCommentArgs = {
  id: Scalars['Float'];
};

export type MutationCreatePostArgs = {
  input: CreatePostInput;
};

export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};

export type MutationRemovePostArgs = {
  id: Scalars['Float'];
};

export type MutationReactToPostArgs = {
  postId: Scalars['Float'];
};

export type MutationReportPostArgs = {
  postId: Scalars['Float'];
};

export type UpdateUserInput = {
  zaloId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['Float']>;
  avatarUrl?: Maybe<Scalars['String']>;
  isNew?: Maybe<Scalars['Boolean']>;
};

export type UpdateMediaInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type NewUserInput = {
  zaloId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nickname?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['Float']>;
  avatarUrl?: Maybe<Scalars['String']>;
  isNew?: Maybe<Scalars['Boolean']>;
};

export type CreateCommentInput = {
  content: Scalars['String'];
  parentId?: Maybe<Scalars['Float']>;
  postId: Scalars['Float'];
};

export type UpdateCommentInput = {
  content: Scalars['String'];
  parentId?: Maybe<Scalars['Float']>;
  postId: Scalars['Float'];
  id: Scalars['Float'];
};

export type CreatePostInput = {
  medias?: Maybe<Array<Scalars['Float']>>;
  caption?: Maybe<Scalars['String']>;
  rawCaption?: Maybe<Scalars['String']>;
};

export type UpdatePostInput = {
  medias?: Maybe<Array<Scalars['Float']>>;
  caption?: Maybe<Scalars['String']>;
  rawCaption?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateComment: Comments;
};

export type SubscriptionOnCreateCommentArgs = {
  postId: Scalars['Float'];
};
