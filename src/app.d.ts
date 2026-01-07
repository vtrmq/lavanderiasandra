// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    
    interface Locals {
      user: {
        user_id: number
        laundry_id: number
        name: string
        phone: string
        profile: 'A' | 'U'
      } | null
    }

    interface Platform {
      //env: Env
      env: {
        DB: D1Database;
      }
      cf: CfProperties
      ctx: ExecutionContext
    }
  }
}

export {};
