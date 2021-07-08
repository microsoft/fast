import {flags} from '@oclif/command'

import Base from '../command-base'

export interface Options {
  name: string;
  defaults?: boolean;
  force?: boolean;
}

export default class Generate extends Base {
  static description = 'Generates a new FAST resource (i.e. Component)'

  static flags = {
    defaults: flags.boolean({description: 'use defaults for every setting'}),
    force: flags.boolean({description: 'overwrite existing files'}),
  }

  static args = [
    {
      name: 'name',
      description: 'The desired name of your resource',
      required: true,
    },
  ]

  async run() {
    const {flags, args} = this.parse(Generate)
    await super.generate('component', {
      name: args.name,
      defaults: flags.defaults,
      force: flags.force,
    } as Options)
  }
}
