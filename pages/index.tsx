import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMortgageCalculator } from "@/hooks/useMortgageCalculator";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { InterestRateData, MortgageFormData } from "@/types/mortgage";
import CalculateMortgageForm from "@/components/calculateMortgageForm";
import MortgageYearlyBreakdown from "@/components/mortgageYearlyBreakdown";
import MortgageInfo from "@/components/mortgageInfo";
import { InterestRateService } from "@/services/interestRate";

export const getServerSideProps = (async () => {
  const URL = process.env.INTEREST_RATE_API_URL;
  if (!URL) throw new Error('INTEREST_RATE_API_URL not found');

  const data = await InterestRateService.fetchCurrentRate(URL);
  return { props: data };
}) satisfies GetServerSideProps<InterestRateData>

export default function MortgageCalculator({ date, rate }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    results,
    errors,
    calculateMortgage,
  } = useMortgageCalculator();

  const handleSubmit = (mortgageFormData: MortgageFormData) => {
    calculateMortgage({
      propertyPrice: mortgageFormData.price,
      deposit: mortgageFormData.deposit,
      annualInterestRate: mortgageFormData.interest,
      termInYears: mortgageFormData.term
    });
  };


  return (
    <Container>
      <title>Mortgage Calculator Test</title>
      <Row className="gap-x-10 pt-3">
        {/* Form */}
        <Col className="border-r" md="auto">
          <CalculateMortgageForm
            defualtInterestRate={rate}
            handleSubmit={handleSubmit} />
        </Col>

             {/* Results */}`
        {results && (
          <>
            <Col md="auto" className="w-24">
              <h2 className="pb-3">Results</h2>
              <MortgageInfo mortgageInfo={results} />
            </Col>

            <Col md="auto">
              <h2 className="pb-3">Yearly Breakdown</h2>
              <MortgageYearlyBreakdown
                yearlyBreakdown={results.yearlyBreakdown} />
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}
