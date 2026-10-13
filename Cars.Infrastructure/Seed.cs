using Cars.Domain;

namespace Cars.Infrastructure;

public static class Seed
{
    public static void SeedData(DataContext context)
    {
        if (context.Cars.Any()) return;

        var cars = new List<Car>
        {
            new Car
            {
                Id = Guid.NewGuid(),
                Brand = "Toyota",
                Model = "Corolla",
                DoorsNumber = 5,
                LuggageCapacity = 360,
                EngineCapacity = 1800,
                FuelType = FuelType.Hybrid,
                ProductionDate = new DateTime(2022, 5, 10),
                AverageFuelConsumption = 4.5,
                BodyType = BodyType.Hatchback
            },
            new Car
            {
                Id = Guid.NewGuid(),
                Brand = "Skoda",
                Model = "Octavia",
                DoorsNumber = 5,
                LuggageCapacity = 600,
                EngineCapacity = 2000,
                FuelType = FuelType.Diesel,
                ProductionDate = new DateTime(2020, 11, 20),
                AverageFuelConsumption = 5.2,
                BodyType = BodyType.Kombi
            }
        };

        context.Cars.AddRange(cars);
        context.SaveChanges();
    }
}