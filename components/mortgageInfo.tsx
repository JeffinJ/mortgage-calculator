import { FullMortgageResults } from "@/types/mortgage";
import { formatCurrency } from "@/utils/formatCurrency";
import Table from "react-bootstrap/Table";

type MortgageInfoProps = {
    mortgageInfo: FullMortgageResults
};

export default function MortgageInfo({ mortgageInfo }: MortgageInfoProps) {
    return (
        <Table striped="columns">
            <tbody className="">
                <tr className="border-b border-t">
                    <td className="">Monthly Payment</td>
                    <td className="font-medium text-right">{formatCurrency(mortgageInfo.monthlyPayment)}</td>
                </tr>
                <tr className="border-b">
                    <td className="">Total Repayment</td>
                    <td className="font-medium text-right">{formatCurrency(mortgageInfo.totalRepayment)}</td>
                </tr>
                <tr className="border-b">
                    <td className="">Capital</td>
                    <td className="font-medium text-right">{formatCurrency(mortgageInfo.capital)}</td>
                </tr>
                <tr className="border-b">
                    <td className="">Interest</td>
                    <td className="font-medium text-right">{formatCurrency(mortgageInfo.interest)}</td>
                </tr>
                <tr className="border-b">
                    <td className="">Affordability check</td>
                    <td className="font-medium text-right">{formatCurrency(mortgageInfo.affordabilityCheck)}</td>
                </tr>
            </tbody>
        </Table>
    )
}