import { Box, BoxProps } from '@mui/material';
import { borderColors } from '../../theme';

interface PaperBoxProps extends BoxProps {
  variant?: 'default' | 'header' | 'accent';
}

const PaperBox = ({ children, variant = 'default', sx, ...props }: PaperBoxProps) => {
  const bgColors = {
    default: '#fbf2af',
    header: '#f6ee90',
    accent: '#fffcb0',
  };

  return (
    <Box
      sx={{
        backgroundColor: bgColors[variant],
        border: `3px solid ${borderColors.main}`,
        boxShadow: `
          0 0 0 2px ${borderColors.outer},
          4px 4px 0 ${borderColors.shadow}
        `,
        borderRadius: 2,
        p: 2,
        position: 'relative',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default PaperBox;

