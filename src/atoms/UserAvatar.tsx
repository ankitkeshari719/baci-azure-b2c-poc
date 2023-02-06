import { Avatar } from '@mui/material';

export function UserAvatar({ userNickname }: { userNickname?: string }) {
  const words = userNickname ? userNickname.toUpperCase().split(' ') : '';
  const display =
    words.length === 1
      ? words[0].substring(0, 2)
      : words[0].substring(0, 1) + words[1].substring(0, 1);

  return (
    <Avatar
      sx={{
        height: '24px',
        width: '24px',
        margin: '4px 0',
        border: '1px solid #CDCDD4',
        background: 'white',
        color: 'black',
        fontSize: '0.75rem',
      }}
    >
      {display}
    </Avatar>
  );
}
