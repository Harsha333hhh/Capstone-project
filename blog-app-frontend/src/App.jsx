import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import AddArticle from './components/AddArticle'
import EditArticle from './components/EditArticle'
import ArticleList from './components/ArticleList'
import ArticleDetail from './components/ArticleDetail'
import UserProfile from './components/userProfile'
import AuthorProfile from './components/authorProfile'
import {ToastBar} from 'react-hot-toast'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,        // Header + Footer wrapped here
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'user-profile', element: <UserProfile /> },
      { path: 'author-profile', element: <AuthorProfile /> },
      { path: 'register', element: <Register /> },
      { path: 'articles', element: <ArticleList /> },
      { path: 'add-article', element: <AddArticle /> },
      { path: 'edit-article/:articleId', element: <EditArticle /> },
      { path: 'article/:articleId', element: <ArticleDetail /> },
    ],
  },
])

function App() {

  return (
  <RouterProvider router={router} />
  )
}

export default App