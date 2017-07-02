import Category from './Category';
interface Vacancy {
  add_date: string;
  description: string;
  header: string;
  rubrics: Array<Category>;
  id: number;
  url: string;
};

export default Vacancy;
