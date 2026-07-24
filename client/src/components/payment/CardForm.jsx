import { CreditCard, User, Calendar, Lock } from "lucide-react";
import Input from "../common/Input";

function CardForm({ card, setCard, errors = {}, setErrors }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error for field being edited
    if (setErrors && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "cardNumber") {
      // Allow only digits and spaces, format as groups of 4
      const digits = value.replace(/\D/g, "").slice(0, 16);
      const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCard((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }

    if (name === "expiry") {
      // Auto-insert slash after MM
      const digits = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setCard((prev) => ({ ...prev, expiry: formatted }));
      return;
    }

    if (name === "cvv") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, cvv: digits }));
      return;
    }

    setCard((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Input
        label="Card Number"
        icon={CreditCard}
        name="cardNumber"
        placeholder="1234 5678 9012 3456"
        value={card.cardNumber}
        onChange={handleChange}
        inputMode="numeric"
        autoComplete="cc-number"
        error={errors.cardNumber}
      />

      <Input
        label="Cardholder Name"
        icon={User}
        name="cardHolderName"
        placeholder="John Doe"
        value={card.cardHolderName}
        onChange={handleChange}
        autoComplete="cc-name"
        error={errors.cardHolderName}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Expiry"
          icon={Calendar}
          name="expiry"
          placeholder="MM/YY"
          value={card.expiry}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="cc-exp"
          error={errors.expiry}
        />

        <Input
          label="CVV"
          icon={Lock}
          name="cvv"
          placeholder="•••"
          type="password"
          value={card.cvv}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="cc-csc"
          error={errors.cvv}
        />
      </div>
    </div>
  );
}

export default CardForm;
