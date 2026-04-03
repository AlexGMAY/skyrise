// "use server";

// import {
//   ACHClass,
//   CountryCode,
//   TransferAuthorizationCreateRequest,
//   TransferCreateRequest,
//   TransferNetwork,
//   TransferType,
// } from "plaid";

// import { plaidClient } from "../plaid";
// import { parseStringify } from "../utils";

// import { getTransactionsByBankId } from "./transaction.actions";
// import { getBanks, getBank } from "./user.actions";

// // Get multiple bank accounts
// export const getAccounts = async ({ userId }: getAccountsProps) => {
//   try {
//     // get banks from db
//     const banks = await getBanks({ userId });

//     const accounts = await Promise.all(
//       banks?.map(async (bank: Bank) => {
//         // get each account info from plaid
//         const accountsResponse = await plaidClient.accountsGet({
//           access_token: bank.accessToken,
//         });
//         const accountData = accountsResponse.data.accounts[0];

//         // get institution info from plaid
//         const institution = await getInstitution({
//           institutionId: accountsResponse.data.item.institution_id!,
//         });

//         const account = {
//           id: accountData.account_id,
//           availableBalance: accountData.balances.available!,
//           currentBalance: accountData.balances.current!,
//           institutionId: institution.institution_id,
//           name: accountData.name,
//           officialName: accountData.official_name,
//           mask: accountData.mask!,
//           type: accountData.type as string,
//           subtype: accountData.subtype! as string,
//           appwriteItemId: bank.$id,
//           sharaebleId: bank.shareableId,
//         };

//         return account;
//       })
//     );

//     const totalBanks = accounts.length;
//     const totalCurrentBalance = accounts.reduce((total, account) => {
//       return total + account.currentBalance;
//     }, 0);

//     return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
//   } catch (error) {
//     console.error("An error occurred while getting the accounts:", error);
//   }
// };

// // Get one bank account
// export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
//   try {
//     // get bank from db
//     const bank = await getBank({ documentId: appwriteItemId });

//     // get account info from plaid
//     const accountsResponse = await plaidClient.accountsGet({
//       access_token: bank.accessToken,
//     });
//     const accountData = accountsResponse.data.accounts[0];

//     // get transfer transactions from appwrite
//     const transferTransactionsData = await getTransactionsByBankId({
//       bankId: bank.$id,
//     });

//     const transferTransactions = transferTransactionsData.documents.map(
//       (transferData: Transaction) => ({
//         id: transferData.$id,
//         name: transferData.name!,
//         amount: transferData.amount!,
//         date: transferData.$createdAt,
//         paymentChannel: transferData.channel,
//         category: transferData.category,
//         type: transferData.senderBankId === bank.$id ? "debit" : "credit",
//       })
//     );

//     // get institution info from plaid
//     const institution = await getInstitution({
//       institutionId: accountsResponse.data.item.institution_id!,
//     });

//     const transactions = await getTransactions({
//       accessToken: bank?.accessToken,
//     });

//     const account = {
//       id: accountData.account_id,
//       availableBalance: accountData.balances.available!,
//       currentBalance: accountData.balances.current!,
//       institutionId: institution.institution_id,
//       name: accountData.name,
//       officialName: accountData.official_name,
//       mask: accountData.mask!,
//       type: accountData.type as string,
//       subtype: accountData.subtype! as string,
//       appwriteItemId: bank.$id,
//     };

//     // sort transactions by date such that the most recent transaction is first
//       const allTransactions = [...transactions, ...transferTransactions].sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     return parseStringify({
//       data: account,
//       transactions: allTransactions,
//     });
//   } catch (error) {
//     console.error("An error occurred while getting the account:", error);
//   }
// };

// // Get bank info
// export const getInstitution = async ({
//   institutionId,
// }: getInstitutionProps) => {
//   try {
//     const institutionResponse = await plaidClient.institutionsGetById({
//       institution_id: institutionId,
//       country_codes: ["US"] as CountryCode[],
//     });

//     const intitution = institutionResponse.data.institution;

//     return parseStringify(intitution);
//   } catch (error) {
//     console.error("An error occurred while getting the accounts:", error);
//   }
// };

// // Get transactions
// export const getTransactions = async ({
//   accessToken,
// }: getTransactionsProps) => {
//   let hasMore = true;
//   let transactions: any = [];

//   try {
//     // Iterate through each page of new transaction updates for item
//     while (hasMore) {
//       const response = await plaidClient.transactionsSync({
//         access_token: accessToken,
//       });

//       const data = response.data;

//       transactions = response.data.added.map((transaction) => ({
//         id: transaction.transaction_id,
//         name: transaction.name,
//         paymentChannel: transaction.payment_channel,
//         type: transaction.payment_channel,
//         accountId: transaction.account_id,
//         amount: transaction.amount,
//         pending: transaction.pending,
//         category: transaction.category ? transaction.category[0] : "",
//         date: transaction.date,
//         image: transaction.logo_url,
//       }));

//       hasMore = data.has_more;
//     }

//     return parseStringify(transactions);
//   } catch (error) {
//     console.error("An error occurred while getting the accounts:", error);
//   }
// };

// lib/actions/bank.actions.ts
"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // Validate userId
    if (!userId) {
      console.error("getAccounts: No userId provided");
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }

    console.log("Getting accounts for userId:", userId);
    
    // get banks from db - this should now work since the documents have userId field
    const banks = await getBanks({ userId });
    
    console.log("Found banks:", banks?.length || 0);

    if (!banks || banks.length === 0) {
      return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
    }

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        try {
          // get each account info from plaid
          const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
          });
          const accountData = accountsResponse.data.accounts[0];

          // get institution info from plaid
          const institution = await getInstitution({
            institutionId: accountsResponse.data.item.institution_id!,
          });

          const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.$id,
            shareableId: bank.shareableId,
          };

          return account;
        } catch (bankError) {
          console.error(`Error processing bank ${bank.$id}:`, bankError);
          return null;
        }
      })
    );

    // Filter out any failed bank accounts
    const validAccounts = accounts.filter(account => account !== null);
    
    const totalBanks = validAccounts.length;
    const totalCurrentBalance = validAccounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: validAccounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    // Return empty data structure instead of throwing
    return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });
    
    if (!bank) {
      console.error("Bank not found:", appwriteItemId);
      return parseStringify({ data: null, transactions: [] });
    }

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from appwrite
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...(transactions || []), ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
    return parseStringify({ data: null, transactions: [] });
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    if (!institutionId) {
      console.error("No institutionId provided");
      return null;
    }
    
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const institution = institutionResponse.data.institution;
    return parseStringify(institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
    return null;
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let allTransactions: any = [];

  try {
    if (!accessToken) {
      console.error("No access token provided");
      return [];
    }
    
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;
      
      const newTransactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));
      
      allTransactions = [...allTransactions, ...newTransactions];
      hasMore = data.has_more;
    }

    return parseStringify(allTransactions);
  } catch (error) {
    console.error("An error occurred while getting the transactions:", error);
    return [];
  }
};

// Create transfer
export const createTransfer = async (transferData: TransferCreateRequest) => {
  try {
    const response = await plaidClient.transferCreate(transferData);
    return parseStringify(response.data);
  } catch (error) {
    console.error("An error occurred while creating transfer:", error);
    throw error;
  }
};

// Create transfer authorization
export const createTransferAuthorization = async (
  authorizationData: TransferAuthorizationCreateRequest
) => {
  try {
    const response = await plaidClient.transferAuthorizationCreate(authorizationData);
    return parseStringify(response.data);
  } catch (error) {
    console.error("An error occurred while creating transfer authorization:", error);
    throw error;
  }
};