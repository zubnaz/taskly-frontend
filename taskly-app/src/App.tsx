import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RegisterPage } from './components/authentication/RegisterPage'
import { PageNotFound } from './components/general/PageNotFound'

import { useEffect } from 'react'
import { useAppDispatch, useRootState } from './redux/hooks'
import { checkSolanaTokenAsync, checkTokenAsync } from './redux/actions/authenticateAction'
import { DashboardPage } from './components/user/DashboardPage'
import { ForgotPasswordPage } from './components/authentication/ForgotPasswordPage'
import { AuthenticationPage } from './components/authentication/AuthenticationPage'
import { ChangePasswordPage } from './components/authentication/ChangePasswordPage'
import MainContainer from "./components/general/MainContainer.tsx";
import AIAgent from "./components/user/AiAgent.tsx";
import { BoardsPage } from './components/boards/BoardsPage.tsx'
import { BoardPage } from './components/boards/BoardPage.tsx'
import MainPage from "./components/general/MainPage.tsx";
import { ProfilePage } from "./components/user/ProfilePage.tsx";
import TablesListPage from "./components/table/TablesListPage.tsx";
import TablePage from "./components/table/TablePage.tsx";
import TableFormPage from "./components/table/TableFormPage.tsx";
import { CreateTableItemPage } from "./components/table/CreateTableItemPage.tsx";
import AddMemberToTablePage from "./components/table/AddMemberToTablePage.tsx";
import ListOfMembersInTable from "./components/table/ListOfMembersInTable.tsx";
import { WalletContextProvider } from "./providers/WalletContextProvider.tsx";
import { UnifiedLoginPage } from "./components/authentication/UnifiedLoginPage.tsx";
import { CreateBoardPage } from './components/boards/CreateBoardPage.tsx'
import SetUserNameForSolanaUser from "./components/authentication/SetUserNameForSolanaUser.tsx";
import CreateFeedbackPage from "./components/feedback/CreateFeedbackPage.tsx";
import FeedbacksPage from "./components/feedback/FeedbacksPage.tsx";
import { AchievementsPage } from './components/achievements/AchievementsPage.tsx'
import CreateChallengePage from "./components/gamification/CreateChallengePage.tsx";
import ChallengesPage from "./components/gamification/ChallengesPage.tsx";
import ChallengePage from "./components/gamification/ChallengePage.tsx";



function App() {

  const dispatch = useAppDispatch();

  const isLogin = useRootState(s => s.authenticate.isLogin);
  const isAuthenticated = useRootState(s => s.authenticate.isAuthenticated);
  const userProfile = useRootState(s => s.authenticate.userProfile);

  const checkAuthToken = async () => {
    const authMethod = localStorage.getItem("authMethod") as "jwt" | "solana" | null;

    if (authMethod === "jwt") {
      await dispatch(checkTokenAsync());
    } else if (authMethod === "solana") {
      await dispatch(checkSolanaTokenAsync());
    }
  };

  useEffect(() => {
    checkAuthToken();
  }, [])

  return (
    <WalletContextProvider>
      <MainContainer>
        <Routes>

          <Route path="/" element={<DashboardPage />}>
            <Route path="" element={<MainPage />} />

            <Route path="artificial-intelligence" element={<AIAgent />} />
            <Route path="artificial-intelligence" element={<AIAgent />} />
            <Route path="feedbacks" element={<FeedbacksPage />} />

            {isLogin && (<>
              <Route path='/boards' element={<BoardsPage />} />
              <Route path='/boards/:boardId' element={<BoardPage />} />
              <Route path='/boards/create' element={<CreateBoardPage />} />
              <Route path='/edit-profile' element={<ProfilePage />} />
              <Route path='/tables' element={<TablesListPage />} />
              <Route path='/tables/create' element={<TableFormPage />} />
              <Route path="/tables/:tableId" element={<TablePage />} />
              <Route path="/tables/edit/:tableId" element={<TableFormPage />} />
              <Route path="/tables/:tableId/create" element={<CreateTableItemPage />} />
              <Route path="/tables/:tableId/add-member" element={<AddMemberToTablePage />} />
              <Route path="/tables/:tableId/members" element={<ListOfMembersInTable />} />
              <Route path="/feedbacks/create" element={<CreateFeedbackPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/challenges/:challengeId" element={<ChallengePage />} />
              {userProfile?.email === 'tasklytodolist@gmail.com' && (
                  <Route path="/challenges/create" element={<CreateChallengePage />} />
              )}
            </>)}
            {isLogin && isAuthenticated === true && (<>
              <Route path='/achievements' element={<AchievementsPage />} />
            </>)}
            <Route path='/boards' element={<Navigate to="/authentication/login" />} />


          </Route>

          <Route path='/authentication/' element={<AuthenticationPage />}>
            <Route path="login" element={<UnifiedLoginPage />} />
            <Route path="solana-login" element={<UnifiedLoginPage />} />
            <Route path="set-username-solana" element={<SetUserNameForSolanaUser />} />

            <Route path='register' element={<RegisterPage />}></Route>
            <Route path="forgot-password" element={<ForgotPasswordPage />}></Route>
            <Route path={`change-password/:key`} element={<ChangePasswordPage />}></Route>
          </Route>


          <Route path='*' element={<PageNotFound />} />

        </Routes>
      </MainContainer>
    </WalletContextProvider>
  )
}

export default App