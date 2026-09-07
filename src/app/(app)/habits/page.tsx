import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { AddHabitForm } from "@/features/habits/components/add-habit-form";
import { HabitCard } from "@/features/habits/components/habit-card";
import { listHabits } from "@/features/habits/queries";

export const metadata = { title: "Habits" };

export default async function HabitsPage() {
  const habits = await listHabits();
  const doneToday = habits.filter((habit) => habit.doneToday).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        description={
          habits.length === 0
            ? "Track something you want to do regularly."
            : `${doneToday} of ${habits.length} done today.`
        }
      />
      <AddHabitForm />

      {habits.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Add one above, then tick off each day to build a streak."
        />
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
