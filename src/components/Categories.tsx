import React from "react";

type CategoriesProps = {
  value: number;
  onChangeCategory: (i: number) => void
}

const categories = ['Все', 'Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const Categories: React.FC<CategoriesProps> = React.memo(({value, onChangeCategory}) => {

  return (
    <div className="categories">
      <ul>
        {
          categories.map((categoryName, i) => (
            <li 
              onClick={() => onChangeCategory(i)} 
              className={value == i ? 'active' : ''}
              key={i}
            >
              {categoryName}
            </li>
          ))
        }
      </ul>
    </div>
  )
})

export default Categories;