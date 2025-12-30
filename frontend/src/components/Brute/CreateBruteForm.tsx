import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Add, Check } from '@mui/icons-material';
import { CreateBruteInput } from '../../types';
import { useSkills } from '../../hooks/useBrute';

interface CreateBruteFormProps {
  onSubmit: (data: CreateBruteInput) => Promise<void>;
  onCancel?: () => void;
}

const CreateBruteForm: React.FC<CreateBruteFormProps> = ({ onSubmit, onCancel }) => {
  const { skills, loading: loadingSkills } = useSkills();
  
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, skillId];
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    
    if (name.length < 2 || name.length > 50) {
      setError('El nombre debe tener entre 2 y 50 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      await onSubmit({
        name: name.trim(),
        skillIds: selectedSkills.length > 0 ? selectedSkills : undefined,
        appearance: { gender },
      });
    } catch (err: any) {
      setError(err.message || 'Error al crear el brute');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        background: 'rgba(0,0,0,0.3)',
        border: '2px solid rgba(212, 175, 55, 0.3)',
      }}
    >
      <Typography variant="h5" gutterBottom color="primary.main">
        Crear Nuevo Brute
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre del Brute"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: GladiadorMax"
            required
            disabled={loading}
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Género</InputLabel>
            <Select
              value={gender}
              label="Género"
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              disabled={loading}
            >
              <MenuItem value="male">Masculino</MenuItem>
              <MenuItem value="female">Femenino</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Selecciona hasta 3 habilidades:
          </Typography>
          
          {loadingSkills ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const isDisabled = !isSelected && selectedSkills.length >= 3;
                
                return (
                  <Tooltip
                    key={skill.id}
                    title={skill.description || skill.nameEn}
                    arrow
                  >
                    <Chip
                      label={skill.nameEs || skill.nameEn}
                      onClick={() => !loading && handleSkillToggle(skill.id)}
                      icon={isSelected ? <Check /> : undefined}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      disabled={isDisabled || loading}
                      sx={{
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          )}
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {selectedSkills.length}/3 habilidades seleccionadas
          </Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Add />}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Brute'}
        </Button>
      </Box>
    </Paper>
  );
};

export default CreateBruteForm;

