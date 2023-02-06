import commonStyles from './../style.module.scss';
import './../global.scss';
import animation from '../assets/img/wild-card-404.gif';
import { Button, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export function PageNotFound() {
    const navigate = useNavigate();
    function goToLanding(){
        navigate(`/`);
    }
    return (
        <Grid container display='flex' justifyContent='center' alignItems='center' flexDirection='column' >
            <img src={animation} style={{height:'calc(100vh - 300px)'}}></img>
            <Typography fontSize='48px' color={commonStyles.PrimaryMain}>Oops!</Typography>
            <Typography mt='23px' mb='48px' variant='h3' color={commonStyles.PrimaryMain}>Could not find the page you are looking for!</Typography>
             <Button
              variant="outlined"
              className="secondaryButton"
              onClick={() => goToLanding()}
            //   onTouchStart={() => goToLanding()}
            >
              <span className="secondaryButtonText">Go back to Home</span>
            </Button>
            
        </Grid>
        
    );
}