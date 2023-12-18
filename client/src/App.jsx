// Desc: This file contains the main component of the app
// ============================================================

// Importing libraries and packages
// ============================================================
import './App.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
    from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
// ============================================================

// Importing components
// ============================================================
import Header from './components/Header';
import Footer from './components/Footer';
// ============================================================

// Import the custom hook
// ==========================================================
import { useTheme } from './utils/useTheme';
// ==========================================================

// Create an error link
// Used (https://www.apollographql.com/docs/react/get-started/#error-handling) as a reference
// ============================================================
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});
// ============================================================

// Construct main GraphQL API endpoint
// ============================================================
const httpLink = createHttpLink({
    uri: '/graphql',
});
// ============================================================

// Construct AuthLink to attach token to every request
// ============================================================
const authLink = setContext((_, { headers }) => {

    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('id_token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});
// ============================================================

// Construct ApolloClient instance including the errorLink and authLink
// Also include the InMemoryCache instance and set credentials to include
// the cookie in every request to the server
// ============================================================
const client = new ApolloClient({
    link: from([errorLink, authLink.concat(httpLink)]),
    cache: new InMemoryCache(),
    credentials: 'include',
});
// ============================================================

// Main App component
// ============================================================
function App() {

    // Pluck values from ThemeContext
    const { darkTheme, theme } = useTheme();

    return (


        <ApolloProvider client={client}>
            <Box
                bg={darkTheme ? theme.colors.light.greenDark : theme.colors.light.greyLight}
                color={darkTheme ? theme.colors.light.greyLight : theme.colors.light.greenDark}
                transition="0.3s ease"
                height="auto"
                width="100vw"
            >
                <Header />
                <Outlet />
                <Footer />
            </Box>
        </ApolloProvider>

    );
}
// ============================================================

// Exporting component
// ============================================================
export default App;
// ============================================================