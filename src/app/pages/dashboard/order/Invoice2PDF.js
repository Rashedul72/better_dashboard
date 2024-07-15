import React, { forwardRef } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  companyDetails: {
    textAlign: 'right',
    fontSize: 12, // Font size for table rows
  },
  separator: {
    borderBottom: '1px solid #e5e7eb', // Tailwind's gray-200
    marginVertical: 10,
  },
  invoiceInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6', // Tailwind's gray-100
    borderBottom: '2px solid #e5e7eb', // Tailwind's gray-200
    fontSize: 10, // Increased font size for table header
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb', // Tailwind's gray-200
    fontSize: 12, // Font size for table rows
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 10,
  },
  cell1: {
    width: '5%',
    backgroundColor: '#2596be', // Tailwind's green-100
    color: '#FFFFFF', // Custom color
    padding: 15,
  },
  cell2: {
    width: '40%',
    fontWeight: 'bold', // Bold font
    backgroundColor: '#eeeeee', // Tailwind's green-100
    padding: 15,
  },
  cell3: {
    textAlign: 'center',
    width: '20%',
    backgroundColor: '#dddddd', // Tailwind's green-100
    padding: 15,
  },
  cell4: {
    textAlign: 'center',
    width: '15%',
    backgroundColor: '#eeeeee', // Tailwind's green-100
    padding: 15,
  },
  cell5: {
    textAlign: 'center',
    width: '20%',
    backgroundColor: '#2596be', // Tailwind's green-100
    color: '#FFFFFF', // Custom color
    padding: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  grandTotal: {
    fontSize: 26, // Increase font size
    fontWeight: 'bold', // Bold font
    color: '#2596be', // Custom color
    textShadow: '2px 2px 2px rgba(0, 0, 0, 0.4)', // Adding text shadow for emphasis
  },
  thankYou: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold', // Bold font
  },
  footer: {
    borderTop: '1px solid #e5e7eb', // Separator line
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280', // Tailwind's gray-500
    marginTop: 'auto',
  },
});

// Forwarding the ref for use with react-to-print
const InvoicePDF = forwardRef(({ order }, ref) => (
  <Document>
    <Page size="A4" style={styles.page} ref={ref}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/better.png" /> {/* Replace with the path to your logo */}
        <View style={styles.companyDetails}>
          <Text>Farm Cottage, Al Amin Baria, P.O,</Text>
          <Text>2103, P.S Chandgoan, Chattogram.</Text> 
          <Text>Hotline: 564-555-1234</Text>
        </View>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.invoiceInfo}>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Invoice To:</Text>
          <Text>{order.name}</Text>
          <Text>{order.phone_no}</Text>
          <Text>{order.Address}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>
            Date of Invoice: {new Date().toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka' })}{' '}
            {new Date().toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka' })}
          </Text>
          <Text style={{ fontWeight: 'bold' }}>
            Date of Order: {new Date(order.timestamp).toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka' })}{' '}
            {new Date(order.timestamp).toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka' })}
          </Text>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, styles.cell1]}>#</Text>
        <Text style={[styles.tableCell, styles.cell2, styles.bold]}>Name</Text>
        <Text style={[styles.tableCell, styles.cell3]}>Unit Price</Text>
        <Text style={[styles.tableCell, styles.cell4]}>Quantity</Text>
        <Text style={[styles.tableCell, styles.cell5]}>Total</Text>
      </View>

      {order.products && order.products.map((product, index) => (
        <View key={product.product_name} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.cell1]}>{index + 1}</Text>
          <Text style={[styles.tableCell, styles.cell2]}>{product.product_name}</Text>
          <Text style={[styles.tableCell, styles.cell3]}>BDT {product.price}</Text>
          <Text style={[styles.tableCell, styles.cell4]}>{product.quantity}</Text>
          <Text style={[styles.tableCell, styles.cell5]}>BDT {product.price * product.quantity}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Sub Total: BDT {order.total_price}</Text>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.totalRow}>
        <Text style={styles.grandTotal}>Grand Total: BDT {order.total_price}</Text>
      </View>

      <Text style={styles.thankYou}>Thank You!</Text>

      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text>If you have any questions about this invoice, please contact us at support@example.com.</Text>
        <Text>Visit our website: www.example.com</Text>
      </View>
    </Page>
  </Document>
));
InvoicePDF.displayName = 'InvoicePDF';
export default InvoicePDF;
