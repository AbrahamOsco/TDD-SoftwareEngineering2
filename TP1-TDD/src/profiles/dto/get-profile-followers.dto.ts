export class GetProfileFollowersDto {
  username: string;
  followers: { username: string }[];
}
