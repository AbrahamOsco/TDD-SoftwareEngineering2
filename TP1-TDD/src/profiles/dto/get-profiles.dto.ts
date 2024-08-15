export class GetProfilesDto {
  count: number;
  users: { username: string; first_name: string; last_name: string }[];
}
