import React from 'react'
import ReactPaginate from 'react-paginate'
import cls from './Pagination.module.scss'

const Pagination = ({currentPage, onChangePage}) => {
  return (
    <ReactPaginate
      className={cls.root}
      breakLabel='...'
      onPageChange={(e) => onChangePage(e.selected + 1)}
      nextLabel='>'
      previousLabel='<'
      pageRangeDisplayed={4}
      pageCount={3}
      forcePage={currentPage - 1}
      renderOnZeroPageCount={null}
    />
  )
}

export default Pagination