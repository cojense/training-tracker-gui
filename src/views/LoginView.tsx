import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '~/AuthContext';

const LoginView = () => {
  const { setLoginAuth, setUser } = useAuth();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            Welcome to Shyft Training Tracker
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please sign in with your Google account to continue.
          </Typography>
          <GoogleLogin
            onSuccess={(credentialResponse: CredentialResponse) => {
              if (credentialResponse.credential) {
                const decoded: { name: string; email: string; picture: string } = jwtDecode(
                  credentialResponse.credential
                );
                setUser({ name: decoded.name, email: decoded.email, picture: decoded.picture });
                setLoginAuth(true);
              }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginView;
