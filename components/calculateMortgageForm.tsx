import { MortgageFormData } from "@/types/mortgage";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

type CalculateMortgageFormProps = {
    defualtInterestRate: number;
    handleSubmit: (formData: MortgageFormData) => void;
};

export default function CalculateMortgageForm({ defualtInterestRate, handleSubmit }: CalculateMortgageFormProps) {

    const [formData, setFormData] = useState<MortgageFormData>({
        price: 0,
        deposit: 0,
        term: 15,
        interest: defualtInterestRate
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value);

        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <Form onSubmit={submitForm}>
            <Form.Label htmlFor="price">Property Price</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                    id="price"
                    name="price"
                    type="number"
                    required
                    className="no-spinner"
                    step="any"
                    aria-label="Property price (to the nearest pound)"
                    aria-describedby="price-description"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                />
            </InputGroup>
            <Form.Label htmlFor="deposit">Deposit</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                    id="deposit"
                    name="deposit"
                    type="number"
                    required
                    className="no-spinner"
                    step="any"
                    aria-label="Deposit amount (to the nearest pound)"
                    aria-describedby="deposit-description"
                    value={formData.deposit || ""}
                    onChange={handleInputChange}
                />
            </InputGroup>

            <Form.Label htmlFor="term">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="termInYears"
                    name="term"
                    required
                    type="number"
                    step="any"
                    aria-label="Mortgage term in years"
                    aria-describedby="term-description"
                    value={formData.term || ""}
                    onChange={handleInputChange}
                />
                <InputGroup.Text>years</InputGroup.Text>
            </InputGroup>
            <Form.Label htmlFor="interest">Interest rate</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="annualInterestRate"
                    name="interest"
                    type="number"
                    step="any"
                    required
                    className="no-spinner"
                    aria-label="Annual interest rate"
                    aria-describedby="interest-description"
                    value={formData.interest || ""}
                    onChange={handleInputChange}
                />
                <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
            <Button className="w-full" variant="primary" type="submit">
                Calculate
            </Button>
        </Form>
    )
}