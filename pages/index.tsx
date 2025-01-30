import { config } from '@/lib/env'
import { FullMortgageResults, MortgageFormData } from "@/types/mortgage";
import {
  calculateAffordabilityCheck,
  calculateMonthlyPayment,
  calculateTotalRepayment,
  calculateYearlyBreakdown,
  validateMortgageInputs
} from "@/utils/MortgageCalculator/calculateRepayment";
import { GetServerSideProps } from "next";
import bodyParser from "body-parser";
import util from "util";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { InterestRateService } from "@/services/interestRate";
import MortgageInfo from "@/components/mortgageInfo";
import CalculateMortgageForm from "@/components/calculateMortgageForm";
import MortgageYearlyBreakdown from "@/components/mortgageYearlyBreakdown";
const getBody = util.promisify(bodyParser.urlencoded());

type PageProps = {
  formData: MortgageFormData;
  results?: FullMortgageResults;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {

  const URL = config.api.interestRateUrl;
  const interestRateData = await InterestRateService.fetchCurrentRate(URL);

  const { req, res } = context as any;
  if (!req || !res) {
    throw new Error('Invalid context provided');
  }
  await getBody(req, res);

  const formData: MortgageFormData = {
    price: 0,
    deposit: 0,
    term: 25,
    interest: interestRateData.rate
  };

  if (req.method === 'POST' && req.body) {
    try {
      const body = req.body;
      formData.price = Number(body.price);
      formData.deposit = Number(body.deposit);
      formData.term = Number(body.term);
      formData.interest = Number(body.interest);

      const inputs = {
        propertyPrice: Number(body.price),
        deposit: Number(body.deposit),
        annualInterestRate: Number(body.interest),
        termInYears: Number(body.term)
      };

      const validation = validateMortgageInputs(
        inputs.propertyPrice,
        inputs.deposit,
        inputs.annualInterestRate,
        inputs.termInYears
      );

      if (!validation.isValid) {
        return {
          props: {
            formData,
          }
        };
      }

      // Calculate mortgage details
      const monthlyPayment = calculateMonthlyPayment(
        inputs.propertyPrice,
        inputs.deposit,
        inputs.annualInterestRate,
        inputs.termInYears
      );

      const totalRepayment = calculateTotalRepayment(
        monthlyPayment,
        inputs.termInYears
      );

      const capital = inputs.propertyPrice - inputs.deposit;
      const interest = totalRepayment - capital;

      const affordabilityCheck = calculateAffordabilityCheck(
        inputs.propertyPrice,
        inputs.deposit,
        inputs.annualInterestRate,
        inputs.termInYears
      );

      const yearlyBreakdown = calculateYearlyBreakdown(
        inputs.propertyPrice,
        inputs.deposit,
        inputs.annualInterestRate,
        inputs.termInYears,
        monthlyPayment
      );

      return {
        props: {
          formData,
          results: {
            monthlyPayment,
            totalRepayment,
            capital,
            interest,
            affordabilityCheck,
            yearlyBreakdown
          },
        }
      };
    } catch (error) {
      console.error('Server-side calculation error:', error);
      return {
        props: {
          formData
        }
      };
    }
  }

  return {
    props: {
      formData
    }
  };
};

export default function Page({ formData, results }: PageProps) {

  return (
    <Container>
      <Row className="gap-x-10 pt-3">
        <Col className="border-end" md="auto">
          <CalculateMortgageForm
            defaultFormData={{
              price: formData.price,
              deposit: formData.deposit,
              term: formData.term,
              interest: formData.interest
            }}
            handleSubmit={() => { }}
          />
        </Col>

        {results ? (
          <Col md="auto" className="w-24">
            <h2 className="pb-3">Results</h2>
            <MortgageInfo mortgageInfo={results} />
          </Col>
        ) : (
          <Col md="auto" className="w-24">
            <h2 className="pb-3">Results</h2>
            <p>Calculate your mortgage to see results</p>
          </Col>
        )}

        {results && (
          <Col md="auto">
            <h2 className="h4 pb-3">Yearly Breakdown</h2>
            <MortgageYearlyBreakdown yearlyBreakdown={results.yearlyBreakdown} />
          </Col>
        )}

      </Row>
    </Container>
  )
}