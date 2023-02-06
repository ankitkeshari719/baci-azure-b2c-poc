import * as React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { GlobalContext } from '../../contexts/GlobalContext';
import { EmailShareButton } from 'react-share';
import * as Icons from 'heroicons-react';

export function ShareParticipants() {
  const [global, dispatch] = React.useContext(GlobalContext);

  return (
    <Box className="participantContainer">
      <Box component="div" whiteSpace="normal" className="createRetroText">
        Share with participants
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="firstDesignSprint"
      >
        First Design Sprint
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="joinUrl"
      >
        https://baciapp.com
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="withCode"
      >
        with code
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="codeId"
      >
        {global?.currentRetro?.humanId}
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="img"
        alt="Logo"
        src="/images/barcode.png"
      />
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        component="div"
        whiteSpace="normal"
        className="productUrl"
      >
        <Link href="global?.currentRetro?.joinUrl" color="#676767;">
          {global?.currentRetro?.joinUrl}{' '}
        </Link>
        <Icons.DocumentDuplicateOutline
          size={20}
          style={{
            marginLeft: '8px',
            cursor: 'pointer'
          }}
          onClick={() =>
            navigator.clipboard.writeText(global?.currentRetro?.joinUrl!)
          }
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <EmailShareButton
          url={global.currentRetro?.joinUrl + ''}
          style={{
            width: '200px',
            height: '36px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: '1px solid #159ADD',
            filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
            borderRadius: '24px',
            background: '#ffffff',
          }}
        >
          <Typography component="span" className="inviteText">
            <Icons.Mail
              size={20}
              style={{
                marginRight: '8px',
              }}
            />
            invite via email
          </Typography>
        </EmailShareButton>
      </Box>
    </Box>
  );
}
