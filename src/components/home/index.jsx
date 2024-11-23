import React, { } from 'react'
import { useAuth } from '../../contexts/authContext'
import Project_Time_Bar from './project_time_bar'
import Employee_Time_Table from './employee_time_table'
import Cnc_Time from './cnc_time'
import Monthly_Production from './monthly_production'
import Weekly_Production from './weekly_production'
import { ResponsiveContainer } from 'recharts'

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div>
            <ResponsiveContainer width="100%" height="100%">
                <Cnc_Time />
                <div class='grid grid-col-1 :grid-col-2 gap-8 mb-8'>
                    <Project_Time_Bar />
                    <Employee_Time_Table />
                </div>
                <div class='grid grid-col-1 :grid-col-2 gap-8 mb-8'>
                    <Monthly_Production />
                    <Weekly_Production />
                </div>
            </ResponsiveContainer>
        </div>
    )
}

export default Home 