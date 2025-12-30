import { Button, ButtonProps, styled } from '@mui/material';

interface FantasyButtonProps extends ButtonProps {
  fantasy?: 'primary' | 'secondary' | 'success' | 'error';
}

const StyledButton = styled(Button)<{ fantasy: string }>(({ fantasy }) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    primary: {
      bg: '#dbbf95',
      border: '#733d2c',
      text: '#733d2c',
    },
    secondary: {
      bg: '#733d2c',
      border: '#5a2d1f',
      text: '#fbf2af',
    },
    success: {
      bg: '#a9d346',
      border: '#7ba832',
      text: '#fff',
    },
    error: {
      bg: '#ff8889',
      border: '#cc6060',
      text: '#fff',
    },
  };

  const c = colors[fantasy] || colors.primary;

  return {
    display: 'inline-block',
    position: 'relative',
    top: 0,
    borderRadius: 4,
    border: `2px solid ${c.border}`,
    backgroundColor: c.bg,
    color: c.text,
    padding: '8px 20px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontFamily: 'LaBrute, GameFont, arial',
    fontSize: '1rem',
    boxShadow: '2px 3px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.1s ease',
    '&:hover': {
      top: -2,
      boxShadow: '2px 5px rgba(0, 0, 0, 0.3)',
      backgroundColor: c.bg,
    },
    '&:active': {
      top: 1,
      boxShadow: '1px 1px rgba(0, 0, 0, 0.3)',
    },
  };
});

const FantasyButton = ({ fantasy = 'primary', children, ...props }: FantasyButtonProps) => {
  return (
    <StyledButton fantasy={fantasy} {...props}>
      {children}
    </StyledButton>
  );
};

export default FantasyButton;

