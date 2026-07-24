import { AtSign } from "lucide-react";
import Input from "../common/Input";

function UPIForm({ upiId, setUpiId, error, setError }) {
  const handleChange = (e) => {
    setUpiId(e.target.value);
    if (setError && error) setError("");
  };

  return (
    <div className="animate-fade-in-up">
      <Input
        label="UPI ID"
        icon={AtSign}
        type="text"
        placeholder="yourname@upi"
        value={upiId}
        onChange={handleChange}
        error={error}
      />

      {!error && (
        <p className="mt-2.5 text-xs text-muted">
          Enter your UPI ID linked to any bank account
        </p>
      )}
    </div>
  );
}

export default UPIForm;
