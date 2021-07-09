import {
  FormControl,
  IconButton,
  InputLabel,
  TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

export default function NumberInput({
  value,
  onChange,
  min,
  max,
  label,
  step = 1,
}) {
  const safelyChangeNumber = (input) => {
    const val = parseInt(input, 10);
    if (typeof min === 'number' && min > val) return;
    if (typeof max === 'number' && max < val) return;
    onChange(val);
  };

  return (
    <div>
      <IconButton
        onClick={() => {
          safelyChangeNumber(value - step);
        }}
        aria-label="decrement"
      >
        <RemoveIcon />
      </IconButton>
      <FormControl style={{ minWidth: 70 }}>
        <InputLabel style={{ position: 'relative' }}>{label}</InputLabel>
        <TextField
          type="number"
          value={value}
          style={{ width: 110 }}
          inputProps={{
            min,
            max,
            step,
          }}
          onChange={(e) => safelyChangeNumber(e.target.value)}
        />
      </FormControl>
      <IconButton
        onClick={() => {
          safelyChangeNumber(value + step);
        }}
        aria-label="incrment"
      >
        <AddIcon />
      </IconButton>
    </div>
  );
}
