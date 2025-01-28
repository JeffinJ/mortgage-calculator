import { YearlyBreakdown } from "@/types/mortgage";
import Table from "react-bootstrap/Table";
import { formatCurrency } from "../utils/formatCurrency";

type MortgageYearlyBreakdownProps = {
    yearlyBreakdown: YearlyBreakdown[];
};
export default function MortgageYearlyBreakdown({ yearlyBreakdown }: MortgageYearlyBreakdownProps) {
    return (
        <Table className="max-w-52" bordered hover size="sm">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Remaining Debt</th>
                </tr>
            </thead>
            <tbody>
                {yearlyBreakdown.map((year) => (
                    <tr key={year.year}>
                        <td className="text-center">{year.year}</td>
                        <td className="">{formatCurrency(year.remainingDebt)}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    )
};