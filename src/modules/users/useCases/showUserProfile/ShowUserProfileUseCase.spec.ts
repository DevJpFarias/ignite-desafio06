import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe('Show User Profile Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('Should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    })

    const userProfile = await showUserProfileUseCase.execute(user.id!)

    expect(userProfile).toHaveProperty("id")
    expect(userProfile.email).toEqual(user.email)
    expect(userProfile.name).toEqual(user.name)
    expect(userProfile).toHaveProperty("password")
  })

  it('Should not be able to show a nonexistent user', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('1234')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
