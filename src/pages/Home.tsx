import React from 'react'
import { Skeleton, Pagination, PizzaBlock, Categories, Sort } from '../components'
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { setCategoryId, setCurrentPage } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';

const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const isSearch = React.useRef(false)
  const isMounted = React.useRef(false)
  const { items , status} = useSelector(selectPizzaData)
  const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter)
  const sortType = sort.sortProperty

  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id))
  }, [])

  const onChangePage = (n: number) => {
    dispatch(setCurrentPage(n))
  }

  const getPizzas = async () => {

    const order = sortType.includes('-') ? 'asc' : 'desc'
    const sortBy = sortType.replace('-', '')
    const category = categoryId > 0 ? `category=${categoryId}` : ''
    const search = searchValue  ? `&search=${searchValue}` : ''

    dispatch(
      fetchPizzas({
        sortBy, 
        order,
        category,
        search,
        currentPage: String(currentPage)
      })
    )

    window.scrollTo(0,0);
  }

  // Если изменили параметры и был первый рендер
  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     const queryString = qs.stringify({
  //       sortProperty: sortType,
  //       categoryId: categoryId > 0 ? categoryId : null,
  //       currentPage
  //     })
  
  //     navigate(`?${queryString}`)
  //   }
  //   isMounted.current = true
  // }, [categoryId, sortType, searchValue, currentPage])

  // Если был первый рендер, то проверяем URL-параметр и сохраняем в redux
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams

  //     const sort = sortList.find(obj => obj.sortProperty === params.sortBy)
  //     dispatch(setFilters({
  //       searchValue: params.search,
  //       categoryId: Number(params.category),
  //       currentPage: Number(params.currentPage),
  //       sort: sort || sortList[0]
  //     }))
  //     isSearch.current = true
  //   }
  // }, [])

  // Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    window.scrollTo(0,0)

    if (!isSearch.current) {
      getPizzas()
    }
    isSearch.current = false
  }, [categoryId, sortType, searchValue, currentPage])

  const pizzas = items.filter((obj: any) => obj.title.toLowerCase().includes(searchValue.toLowerCase()) ? true : false).map((obj: any) => <PizzaBlock {...obj} key={obj.id} />)
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)

  return (
    <div className='container'>
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory}/>
      <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {
        status === 'error' ? (
          <div className='content__error-info'>
            <h2>Произошла ошибка 😕</h2>
            <p>К сожалению, не удалось получить пиццы. Повторите попытку позже.</p>
          </div>
        ) : (
          <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
        )
      }
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  )
}

export default Home;