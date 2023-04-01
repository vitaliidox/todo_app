import { FormEvent, useContext, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { postTodo } from '../../api/todos';

import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setTodos: (arg: ((prev: Todo[]) => Todo[]) | Todo[]) => void,
  setIsError: (arg: Error | null) => void,
};

export const Header: React.FC<Props> = ({
  setTodos,
  setIsError,
}) => {
  const [query, setQuery] = useState('');
  const user = useContext(AuthContext);

  const postTodosData = async () => {
    if (user && query) {
      const data = {
        title: query,
        userId: user.id,
        completed: false,
      };

      await postTodo(data)
        .then(todo => {
          setTodos((prev) => [...prev, todo]);
        })
        .catch(() => {
          setIsError(Error.Add);
        })
        .finally(() => {
          setQuery('');
        });
    }
  };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    postTodosData();
  };

  return (
    <header className="header">
      <h1 className="header__title">
        {`${user?.name}: todos`}
      </h1>

      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          data-cy="createTodo"
          className="new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event?.target.value)}
        />
      </form>
    </header>
  );
};
