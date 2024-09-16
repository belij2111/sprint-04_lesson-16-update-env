import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { appSettings } from '../../../settings/config';
import { UsersService } from '../application/users.service';

//
// @injectable()
// export class UsersController {
//   constructor(
//     @inject(UsersService) private usersService: UsersService,
//     @inject(UsersMongoQueryRepository) private usersMongoQueryRepository: UsersMongoQueryRepository
//   ) {
//   }
//
//   async create(req: Request, res: Response) {
//     try {
//       const createdInfo = await this.usersService.createUser(req.body)
//       if (createdInfo.status === ResultStatus.BadRequest) {
//         res
//           .status(400)
//           .json({errorsMessages: createdInfo.extensions || []})
//         return
//       }
//       if (createdInfo.data && createdInfo.status === ResultStatus.Success) {
//         const newUser = await this.usersMongoQueryRepository.getUserById(createdInfo.data.id)
//         res
//           .status(201)
//           .json(newUser)
//         return
//       }
//     } catch (error) {
//       res
//         .status(500)
//         .json({message: 'usersController.create'})
//     }
//   }
//
//   async get(req: Request<SortQueryFieldsType & SearchLoginTermFieldsType & SearchEmailTermFieldsType>, res: Response<Paginator<OutputUserType[]> | ErrorResponse>) {
//     try {
//       const inputQuery = {
//         ...sortQueryFieldsUtil(req.query),
//         ...searchLoginTermUtil(req.query),
//         ...searchEmailTermUtil(req.query)
//       }
//       const allUsers = await this.usersMongoQueryRepository.getUsers(inputQuery)
//       res
//         .status(200)
//         .json(allUsers)
//     } catch (error) {
//       res
//         .status(500)
//         .json({message: 'usersController.get'})
//     }
//   }
// }

@Controller(appSettings.getPath().USERS)
export class UsersController {
  constructor(
    // private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersService: UsersService,
  ) {}
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const deletionResult: boolean = await this.usersService.delete(id);
    if (!deletionResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
