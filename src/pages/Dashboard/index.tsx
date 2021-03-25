import { useEffect, useState } from 'react';
import Food, { FoodInterface } from '../../components/Food';
import Header from '../../components/Header';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import api from '../../services/api';
import { FoodsContainer } from './styles';

function Dashboard() {
  const [modalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodInterface>(
    {} as FoodInterface
  );
  const [foods, setFoods] = useState<FoodInterface[]>([]);

  const handleAddFood = async (food: FoodInterface) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditFood = (food: FoodInterface) => {
    setEditingFood(food);
    setIsEditModalOpen(true);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!editModalOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!modalOpen);
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  const handleUpdateFood = async (food: FoodInterface) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await api.get('/foods');
      setFoods(response.data);
    };
    fetchFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
