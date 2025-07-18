'use client';

import { BiMaleFemale } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { FaRegBell } from 'react-icons/fa';
import { HiTrendingDown, HiTrendingUp } from 'react-icons/hi';
import data from './assets/data.json';
import AdminSidebar from './organism/AdminSidebar';
import { BarChart, DoughnutChart } from './organism/Charts';
import DashboardTable from './organism/DashboardTable';
import { Card, H6, Paragraph, View } from 'tamagui';
import { useDarkMode } from '@/hook/useDarkMode';

const userImg =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp';

const Dashboard = () => {
  const isDark = useDarkMode();
  return (
    <div className='admin-container  '>
      <AdminSidebar />
      <main className='dashboard'>
        <div className='bar'>
          <BsSearch />
          <input type='text' placeholder='Search for data, users, docs' />
          <FaRegBell />
          <img src={userImg} alt='User' />
        </div>

        <section className='widget-container'>
          <WidgetItem
            percent={40}
            amount={true}
            value={340000}
            heading='Revenue'
            color='rgb(0, 115, 255)'
          />
          <WidgetItem
            percent={-14}
            value={400}
            color='rgb(0 198 202)'
            heading='Users'
          />
          <WidgetItem
            percent={80}
            value={23000}
            color='rgb(255 196 0)'
            heading='Transactions'
          />

          <WidgetItem
            percent={30}
            value={1000}
            color='rgb(76 0 255)'
            heading='Products'
          />
        </section>

        <section className={`graph-container `}>
          <div
            className={`revenue-chart ${isDark ? ' bg-darkBg' : ' bg-ligthBg'}`}
          >
            <H6>Revenue & Transaction</H6>
            <BarChart
              data_2={[300, 144, 433, 655, 237, 755, 190]}
              data_1={[200, 444, 343, 556, 778, 455, 990]}
              title_1='Revenue'
              title_2='Transaction'
              bgColor_1='rgb(0, 115, 255)'
              bgColor_2='rgba(53, 162, 235, 0.8)'
            />
          </div>

          <div
            className={`dashboard-categories  ${
              isDark ? ' bg-darkBg' : ' bg-ligthBg'
            }`}
          >
            <H6>Inventory</H6>

            <div>
              {data.categories.map((i) => (
                <CategoryItem
                  key={i.heading}
                  value={i.value}
                  heading={i.heading}
                  color={`hsl(${i.value * 4}, ${i.value}%, 50%)`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className='transaction-container'>
          <Card className={`gender-chart`} backgroundColor='$cardBackground'>
            <View flex={1} flexDirection='row' justifyContent='center'>
              <H6 size='$4' margin='$4' textAlign='center'>
                Gender Ratio
              </H6>
            </View>

            <DoughnutChart
              labels={['Female', 'Male']}
              data={[12, 19]}
              backgroundColor={[
                'hsl(340, 82%, 56%)',
                'rgba(53, 162, 235, 0.8)',
              ]}
              cutout={90}
            />
            <Paragraph>
              <BiMaleFemale className={` ${isDark ? ' bg-ligthBg' : ''}`} />
            </Paragraph>
          </Card>
          <DashboardTable data={data.transaction} />
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => {
  return (
    <Card className={`widget`} backgroundColor='$cardBackground'>
      <View className='widget-info'>
        <Paragraph>{heading}</Paragraph>
        <div>
          <H6>{amount ? `₹${value}` : value}</H6>
        </div>
        {percent > 0 ? (
          <span className='green'>
            <HiTrendingUp /> +{percent}%{' '}
          </span>
        ) : (
          <span className='red'>
            <HiTrendingDown /> {percent}%{' '}
          </span>
        )}
      </View>

      <div
        className='widget-circle'
        style={{
          background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
        }}
      >
        <span
          style={{
            color,
          }}
        >
          {percent}%
        </span>
      </div>
    </Card>
  );
};

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className='category-item'>
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
