import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Leave } from "@/types/leave";
import { format } from "date-fns";
import { getPublicFileUrl } from "@/lib/utils/pdf";
import { differenceInDays } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    marginRight: 20,
  },
  logo: {
    width: "100%",
    height: "auto",
  },
  headerText: {
    flex: 1,
    textAlign: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  signatureSection: {
    marginTop: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: 200,
  },
  signatureLine: {
    borderBottom: 1,
    marginBottom: 5,
  },
  signature: {
    width: "100%",
    height: "auto",
  },
});

interface LeavePDFTemplateProps {
  leave: Leave;
  signature?: string;
}

export function LeavePDFTemplate({ leave, signature }: LeavePDFTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            {signature ? (
              <Image src={signature} style={styles.logo} />
            ) : (
              <Image src={getPublicFileUrl("/logo.png")} style={styles.logo} />
            )}
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>LEAVE APPLICATION FORM</Text>
            <Text>Reference: UIPA-QA-R-ADM-4-010</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Employee Name:</Text>
            <Text style={styles.value}>
              {leave.employeeId.firstName} {leave.employeeId.lastName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{leave.employeeId.department}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Leave Type:</Text>
            <Text style={styles.value}>{leave.type}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>
              {format(new Date(leave.startDate), "dd/MM/yyyy")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>
              {format(new Date(leave.endDate), "dd/MM/yyyy")}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Days Requested:</Text>
            <Text style={styles.value}>
              {differenceInDays(
                new Date(leave.endDate),
                new Date(leave.startDate)
              ) + 1}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Reason:</Text>
            <Text style={styles.value}>{leave.reason}</Text>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              {leave.employeeSignature && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${leave.employeeSignature}`}
                  style={styles.signature}
                />
              )}
              <Text>Employee Signature</Text>
              <Text>
                {leave.employeeSignatureDate &&
                  format(new Date(leave.employeeSignatureDate), "dd/MM/yyyy")}
              </Text>
            </View>

            {leave.approvalFlow.supervisorApproval.signature && (
              <View style={styles.signatureBox}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${leave.approvalFlow.supervisorApproval.signature}`}
                  style={styles.signature}
                />
                <Text>Supervisor Signature</Text>
                <Text>
                  {format(
                    new Date(
                      leave.approvalFlow.supervisorApproval.signatureDate!
                    ),
                    "dd/MM/yyyy"
                  )}
                </Text>
              </View>
            )}
          </View>

          {leave.approvalFlow.adminApproval.signature && (
            <View style={styles.signatureRow}>
              <View style={styles.signatureBox}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${leave.approvalFlow.adminApproval.signature}`}
                  style={styles.signature}
                />
                <Text>Admin Signature</Text>
                <Text>
                  {format(
                    new Date(leave.approvalFlow.adminApproval.signatureDate!),
                    "dd/MM/yyyy"
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
