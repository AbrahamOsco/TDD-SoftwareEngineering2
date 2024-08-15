export class GetProfileFollowedDto {
  username: string;
  followed: { username: string }[];
}
