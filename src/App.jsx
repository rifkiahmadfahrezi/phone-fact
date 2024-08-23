import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import UnauthorizedRoute from './components/UnauthorizedRoute'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import Preloader from './components/Preloader'

// public
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Profile = lazy(() => import('./pages/Profile'));
const PhonesPage = lazy(() => import('./pages/PhonesPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const PhoneReviewsPage = lazy(() => import('./pages/PhoneReviewsPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const BrandPage = lazy(() => import('./pages/BrandPage'));

// dashboard
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Admins = lazy(() => import('./pages/dashboard/Admins'));
const Users = lazy(() => import('./pages/dashboard/Users'));
const Brands = lazy(() => import('./pages/dashboard/Brands'));
const Phones = lazy(() => import('./pages/dashboard/Phones'));
const Reviews = lazy(() => import('./pages/dashboard/Reviews'));
const Comments = lazy(() => import('./pages/dashboard/Comments'));
const AddPhonePage = lazy(() => import('./pages/dashboard/AddPhonePage'));
const UpdatePhonePage = lazy(() => import('./pages/dashboard/UpdatePhonePage'));

const NotFound = lazy(() => import('./layouts/NotFound'));

const App = () => {
  return (
    <>
      <Routes>
         <Route path='/' element={ <MainLayout/> }>

            {/* PUBLIC ROUTES  */}
            <Route index element={
               <Suspense fallback={<Preloader />}>
                  <HomePage />
               </Suspense>
            } />
            <Route path='users/:userIDParams/profile' element={
               <Suspense fallback={<Preloader />}>
                  <Profile />
               </Suspense>
            } />
            <Route path='brands' element={
               <Suspense fallback={<Preloader />}>
                  <BrandsPage />
               </Suspense>
            } />
            <Route path='phones' element={
               <Suspense fallback={<Preloader />}>
                  <PhonesPage />
               </Suspense>
            } />
            <Route path='phones/:id/reviews' element={
               <Suspense fallback={<Preloader />}>
                  <PhoneReviewsPage />
               </Suspense>
            } />
            <Route path='reviews/:id/comments' element={
               <Suspense fallback={<Preloader />}>
                  <ReviewPage />
               </Suspense>
            } />
            <Route path='brands/:id' element={
               <Suspense fallback={<Preloader />}>
                  <BrandPage />
               </Suspense>
            } />

            {/* only if user not logged in */}
            <Route element={<UnauthorizedRoute />}>
               <Route path='login' element={
                  <Suspense fallback={<Preloader />}>
                     <LoginPage />
                  </Suspense>
               } />
               <Route path='register' element={
                  <Suspense fallback={<Preloader />}>
                     <RegisterPage />
                  </Suspense>
               } />
            </Route>

            {/* PROTECTED ROUTES (REQUIRE LOGIN [user/admin]) */}

            <Route path='*' element={
               <Suspense fallback={<Preloader />}>
                  <NotFound />
               </Suspense>
            }/>
         </Route>

         {/* ADMIN ONLY */}
         <Route path='/dashboard' element={<RequireAuth allowedRoles={["admin"]}/>}>
            <Route element={ <DashboardLayout/> }>
               <Route index element={
                     <Dashboard />
               } />
               <Route path='admins/:userIDParams/profile' element={
                     <Profile />
               } />
               <Route path='admins' element={
                     <Admins />
               } />
               <Route path='users' element={
                     <Users />
               } />
               <Route path='brands' element={
                     <Brands />
               } />
               <Route path='phones' element={
                     <Phones />
               } />
               
               {/* create phone */}
               <Route path='phones/create' element={
                     <AddPhonePage />
               } />
               {/* update phone */}
               <Route path='phones/update/:id' element={
                     <UpdatePhonePage />
               } />
               <Route path='reviews' element={
                     <Reviews />
               } />
               <Route path='comments' element={
                     <Comments />
               } />

               
               <Route path='*' element={
                  <Suspense fallback={<Preloader />}>
                     <NotFound />
                  </Suspense>
               }/>
               </Route>
         </Route>
      </Routes>
    </>
  )
}



export default App