import React from 'react'
import Sort, { sortList } from '../components/Sort';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import qs from 'qs'
import axios from 'axios';
import { SearchContext } from '../App';
import { useSelector, useDispatch } from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/FilterSlice';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isSearch = React.useRef(false)
  const isMounted = React.useRef(false)
  const {categoryId, sort, currentPage} = useSelector(state => state.filter)
  const sortType = sort.sortProperty
  const {searchValue} = React.useContext(SearchContext)
  const [items, setItems] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id))
  }

  const onChangePage = (n) => {
    dispatch(setCurrentPage(n))
  }

  const fetchPizzas = () => {
    setIsLoading(true)

    const order = sortType.includes('-') ? 'asc' : 'desc'
    const sortBy = sortType.replace('-', '')
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue > 0 ? `&search=${searchValue}` : ''

    axios.get(`https://63427b2e3f83935a7843bf06.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
    .then(r => {
      setItems(r.data)
      setIsLoading(false)
    })
    window.scrollTo(0,0);
  }

  // Если изменили параметры и был первый рендер
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sortType,
        categoryId,
        currentPage
      })
  
      navigate(`?${queryString}`)
    }
    isMounted.current = true
  }, [categoryId, sortType, searchValue, currentPage])

  // Если был первый рендер, то проверяем URL-параметр и сохраняем в redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1))

      const sort = sortList.find(obj => obj.sortProperty === params.sortProperty)

      dispatch(setFilters({
        ...params,
        sort
      }))
      isSearch.current = true
    }
  }, [])

  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    window.scrollTo(0,0)

    if (!isSearch.current) {
      fetchPizzas()
    }
    isSearch.current = false
  }, [categoryId, sortType, searchValue, currentPage])

  const pizzas = items.filter(obj => obj.title.toLowerCase().includes(searchValue.toLowerCase()) ? true : false).map((obj) => <PizzaBlock {...obj} key={obj.id} />)
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

  return (
    <div className='container'>
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
        <Sort/>
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home;