import React from 'react'
import ReactPaginate from 'react-paginate'
import cls from './Pagination.module.scss'

type PaginationProps = {
  currentPage: number;
  onChangePage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, onChangePage}) => {
  return (
    <ReactPaginate
    className={cls.root}
    breakLabel='...'
    onPageChange={(event) => onChangePage(event.selected + 1)}
    nextLabel='>'
    previousLabel='<'
    pageRangeDisplayed={4}
    pageCount={3}
    forcePage={currentPage - 1}
    />
)}

export default Pagination