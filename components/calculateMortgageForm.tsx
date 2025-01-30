import { MortgageFormData } from "@/types/mortgage";
import { CalculateMortgageFormSchema } from "@/utils/schema/mortgage";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CalculateMortgageFormProps = {
    defaultFormData: MortgageFormData;
    handleSubmit: (formData: MortgageFormData) => void;
};

export default function CalculateMortgageForm({ defaultFormData, handleSubmit }: CalculateMortgageFormProps) {
    const {
        register,
        formState: { errors }
    } = useForm<z.infer<typeof CalculateMortgageFormSchema>>({
        resolver: zodResolver(CalculateMortgageFormSchema),
        mode: 'onBlur',
        defaultValues: {
            price: defaultFormData.price,
            deposit: defaultFormData.deposit,
            term: defaultFormData.term,
            interest: defaultFormData.interest
        }
    });

    return (
        <Form
            action=""
            method="POST">
            <Form.Label htmlFor="price">Property Price</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                    id="price"
                    type="number"
                    required
                    className="no-spinner"
                    step="any"
                    aria-label="Property price (to the nearest pound)"
                    aria-describedby="price-description"
                    {...register('price', { valueAsNumber: true })}
                    isInvalid={!!errors.price}
                />
                {errors.price && (
                    <Form.Control.Feedback type="invalid">
                        {errors.price.message}
                    </Form.Control.Feedback>
                )}
            </InputGroup>
            <Form.Label htmlFor="deposit">Deposit</Form.Label>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                    id="deposit"
                    type="number"
                    required
                    className="no-spinner"
                    step="any"
                    aria-label="Deposit amount (to the nearest pound)"
                    aria-describedby="deposit-description"
                    {...register('deposit', { valueAsNumber: true })}
                    isInvalid={!!errors.deposit}
                />
                {errors.deposit && (
                    <Form.Control.Feedback type="invalid">
                        {errors.deposit.message}
                    </Form.Control.Feedback>
                )}
            </InputGroup>

            <Form.Label htmlFor="term">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="termInYears"
                    required
                    type="number"
                    step="any"
                    aria-label="Mortgage term in years"
                    aria-describedby="term-description"
                    {...register('term', { valueAsNumber: true })}
                    isInvalid={!!errors.term}
                />
                { }
                <InputGroup.Text>years</InputGroup.Text>
                {errors.term && (
                    <Form.Control.Feedback type="invalid">
                        {errors.term.message}
                    </Form.Control.Feedback>
                )}
            </InputGroup>
            <Form.Label htmlFor="interest">Interest rate</Form.Label>
            <InputGroup className="mb-3">
                <Form.Control
                    id="annualInterestRate"
                    type="number"
                    step="any"
                    required
                    className="no-spinner"
                    aria-label="Annual interest rate"
                    aria-describedby="interest-description"
                    {...register("interest", { valueAsNumber: true })}
                    isInvalid={!!errors.interest}
                />
                <InputGroup.Text>%</InputGroup.Text>
                {errors.interest && (
                    <Form.Control.Feedback type="invalid">
                        {errors.interest.message}
                    </Form.Control.Feedback>
                )}
            </InputGroup>
            <Button
                className="w-full"
                variant="primary"
                type="submit">
                Calculate
            </Button>
        </Form>
    )
}