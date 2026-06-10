---
title: "Top 50 SQL for Mastery"
date: 2024-12-25T15:52:11Z
tags:
  - sql
  - data
  - interview
categories:
  - data
  - SQL
author: shekhar
layout: layouts/post.njk
---

1.  [Recyclable and Low Fat Products](https://leetcode.com/problems/recyclable-and-low-fat-products/)

```python
def find_products(products: pd.DataFrame) -> pd.DataFrame:
    # return products[(products["low_fats"] == "Y") & (products["recyclable"] =="Y")].loc[:,["product_id"]]
    return products[(products["low_fats"] == "Y") & (products["recyclable"] =="Y")][["product_id"]]
```

```sql
select product_id from Products where low_fats = "Y" and recyclable = "Y"
```

Note: can use df.iloc\[:, \[“column\_name”\]\] or df\[\[“column\_name\]\] df\[“column\_name\] returns series.

2.  [Find Customer Refree](https://leetcode.com/problems/find-customer-referee/)

```python
def find_customer_referee(customer: pd.DataFrame) -> pd.DataFrame:
    return customer[(customer["referee_id"] != 2) | (customer["referee_id"].isnull())][["name"]]
```

or

```python
def find_customer_referee(customer: pd.DataFrame) -> pd.DataFrame:
    customer.fillna(0, inplace=True)
    return customer.loc[customer["referee_id"] !=2 , ["name"]]
```

Note: can insert the logic in the loc

```sql
select name from Customer where referee_id != 2 or referee_id is Null
```

3.  [Big countries](https://leetcode.com/problems/big-countries/?)

```Python
def big_countries(world: pd.DataFrame) -> pd.DataFrame:
    return world[(world["area"] >= 3000000) | (world["population"] > 25000000)][["name", "population", "area"]]
```

```sql
select name, population, area from world where population >= 25000000 or area >= 3000000
```

4.  [Article View](https://leetcode.com/problems/article-views-i/)

```Python
def article_views(views: pd.DataFrame) -> pd.DataFrame:
    return views[views["viewer_id"] == views["author_id"]][["author_id"]].drop_duplicates()
                .sort_values("author_id").rename(columns={"author_id": "id"})
```

```sql
select distinct(author_id) as id from Views where author_id = viewer_id order by id
```

5.  [invalid tweets](https://leetcode.com/problems/invalid-tweets/)

```sql
select tweet_id from Tweets where length(content) >15 
```

```python
def invalid_tweets(tweets: pd.DataFrame) -> pd.DataFrame:22
    return tweets.query(f"content.str.len() >15")[["tweet_id"]]
```

or

```python
    return tweets.loc[tweets.content.str.len() >15, ["tweet_id"]]
```

6.  [Replace Employee id](https://leetcode.com/problems/replace-employee-id-with-the-unique-identifier/)

```python
def replace_employee_id(employees: pd.DataFrame, employee_uni: pd.DataFrame) -> pd.DataFrame:
    return pd.merge(employees, employee_uni, how="left", on=["id", "id"])[["unique_id", "name"]]
```

```sql
select unique_id, name from Employees left join EmployeeUNI on Employees.id = EmployeeUNI.id
```

7.  [Product Sales Analysis](https://leetcode.com/problems/product-sales-analysis-i/)

```sql
SELECT product_name, year, price from Sales left join Product on Sales.product_id = Product.product_id
```

8.  [customer-who-visited-but-did-not-make-any-transactions](https://leetcode.com/problems/customer-who-visited-but-did-not-make-any-transactions)
    
    ```sql
    SELECT 
     customer_id,
     COUNT(*) AS count_no_trans 
    ```
    

FROM Visits LEFT JOIN Transactions ON Visits.visit\_id = Transactions.visit\_id WHERE transaction\_id IS NULL GROUP BY customer\_id; \`\`\` 9. [Rising Temperature](https://leetcode.com/problems/rising-temperature/description/?envType=study-plan-v2&envId=top-sql-50)

```Python
import pandas as pd

def rising_temperature(weather: pd.DataFrame) -> pd.DataFrame:
    if weather.size:
        weather.sort_values(by=['recordDate'], inplace=True)
        weather.reset_index(inplace=True)
        weather.recordDate= pd.to_datetime(weather.recordDate, format="-%Y-%m-%d")
        new_dates = pd.date_range(start=weather['recordDate'][0],
                                  end=weather['recordDate'][len(weather)-1],freq='D')

        weather = weather.set_index("recordDate").reindex(new_dates).reset_index()
        weather.rename(columns={"index": "recordDate"}, inplace=True)
        weather["change"] = weather.temperature - weather.temperature.shift(1, fill_value=weather.temperature[0])
        return weather[weather["change"] > 0.0][["id"]].rename(columns={"id": "Id"})
    else:
        return weather[["id"]].rename(columns={"id":"ID"})
```

```sql
WITH PreviousWeatherData AS
(
    SELECT 
        id,
        recordDate,
        temperature, 
        LAG(temperature, 1) OVER (ORDER BY recordDate) AS PreviousTemperature,
        LAG(recordDate, 1) OVER (ORDER BY recordDate) AS PreviousRecordDate
    FROM 
        Weather
)

SELECT 
    id 
FROM 
    PreviousWeatherData
WHERE 
    temperature > PreviousTemperature
AND 
    recordDate = DATE_ADD(PreviousRecordDate, INTERVAL 1 DAY);
```

This might be slower, as seen in leetcode.

```SQL
SELECT 
    w1.id
FROM 
    Weather w1
WHERE 
    w1.temperature > (
        SELECT 
            w2.temperature
        FROM 
            Weather w2
        WHERE 
            w2.recordDate = DATE_SUB(w1.recordDate, INTERVAL 1 DAY)
    );
```

```SQL
SELECT 
    w1.id
FROM 
    Weather w1
JOIN 
    Weather w2
ON 
    DATEDIFF(w1.recordDate, w2.recordDate) = 1
WHERE 
    w1.temperature > w2.temperature;
```

Bonus:

```sql
select EmpLastName, EmpFirstName, ProjDesc, BldName, DeptName
from Employee, Building, Department, Project
where DeptBuilding = BldID
    and empDeptID = DeptID
    and EmpID = ProjManager
order by EmpLastName, DeptName, BldName
```

Multiple Tables could be used to join without using the word. Make sure to add where clause otherwise, data are added with each new row.

```fallback
from Department
inner join employee
inner join Building
on empDeptID = DeptID
and DeptBuilding = BldId
order by DeptName, EmpSalary desc
```

10.  [Average Time of Process per machine](https://leetcode.com/problems/average-time-of-process-per-machine/description/)

```sql
select a1.machine_id, round(avg(a2.timestamp- a1.timestamp), 3) as processing_time
from Activity a1 
join Activity a2
on a1.machine_id = a2.machine_id and a1.process_id = a2.process_id and a1.timestamp < a2.timestamp 
group by a1.machine_id
```

11.  [Employee Bonus](https://leetcode.com/problems/employee-bonus/submissions/)

```sql
select name, bonus
from Employee
left join Bonus
on Employee.empId = Bonus.empId
where Bonus.bonus < 1000 or Bonus.bonus is null
```

12.  [Students and Examinations](https://leetcode.com/problems/students-and-examinations/)

```sql
select S.student_id, S.student_name, SU.subject_name, COUNT(E.student_id) as attended_exams
from Students S
CROSS JOIN Subjects SU
left join Examinations E
on S.student_id = E.student_id 
AND SU.subject_name = E.subject_name
Group By S.student_id, SU.subject_name
ORDER BY s.student_id
```

13.  [Managers with at least 5 direct reports](https://leetcode.com/problems/managers-with-at-least-5-direct-reports/)

```sql
select b.name
from Employee a
Join Employee b on a.ManagerId = b.id
group by a.ManagerId
having count(*) >= 5
```

14.  [Confirmation rate](https://leetcode.com/problems/confirmation-rate/submissions/1489282877/?envType=study-plan-v2&envId=top-sql-50)

```sql
select s.user_id, round(avg(if(c.action ="confirmed", 1, 0)), 2 ) as confirmation_rate
from SignUps as s
left join Confirmations as c
on s.user_id = c.user_id
group by user_id
```

15.  [Not Boring Movie](https://leetcode.com/problems/not-boring-movies/)

```sql
select * 
from Cinema
where description != "boring" and id%2 !=0
order by rating desc
```

16.  [Average Selling Price](https://leetcode.com/problems/average-selling-price/)

```sql
select P.product_id, ifnull(round(sum(US.units * P.price)/ sum(US.units), 2), 0) as average_price
from Prices as P
left join UnitsSold as US
on US.product_id = P.product_id and US.purchase_date >= P.start_date
    and US.purchase_date <= P.end_date
group by P.product_id
```

17.  [Project employees](https://leetcode.com/problems/project-employees-i/)

```sql
select project_id, ROUND(AVG(experience_years),2) as average_years
from Project P
left join Employee E
on P.employee_id = E.employee_id
group by P.project_id
```

18.  [Percentage of Users attended a contest](https://leetcode.com/problems/percentage-of-users-attended-a-contest/)

```sql
select contest_id, Round(Count(user_id)* 100/ (select count(*) from Users), 2) as percentage
from Register
group by contest_id
order by percentage desc, contest_id asc
```

19.  [Queries quality and Percentage](https://leetcode.com/problems/queries-quality-and-percentage/description/)

```sql
select query_name, ROUND(AVG(Q.rating/ Q.position), 2) AS quality,
    Round(Sum(Q.rating < 3) *100 / Count(Q.rating), 2) as poor_query_percentage
from Queries Q
group by query_name
```

20.  [Monthly Transactions I](https://leetcode.com/problems/monthly-transactions-i)

```SQL
SELECT DATE_FORMAT(trans_date, "%Y-%m") as month, 
    country, 
    Count(*) as trans_count, 
    SUM(state = 'approved') as approved_count,
    SUM(amount) as trans_total_amount,
    SUM(Case when state = 'approved' then amount else 0 end) as approved_total_amount
FROM Transactions
GROUP BY month, country
```

21.  [Immediate Food Delivery](https://leetcode.com/problems/immediate-food-delivery-ii/)

```sql

```

22.  [Game Play Analysis](https://leetcode.com/problems/game-play-analysis-iv/description/)

```sql

```
