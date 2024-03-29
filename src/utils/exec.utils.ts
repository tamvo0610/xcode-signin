import { exec as execCP, execFileSync, spawn } from 'child_process'

export const run = async (str: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execCP(str, (error, stdout) => {
      if (error) {
        return reject(error.message)
      }
      resolve(stdout.trim())
    })
  })
}

export const mkdir = async (path: string): Promise<string> => {
  return await run(`mkdir -p ${path}`)
}

export const rsync = async (source: string, dest: string): Promise<string> => {
  return await run(`rsync -a ${source}/ ${dest}`)
}

export const exists = async (path: string): Promise<boolean> => {
  const res = await run(
    `if [ -d "${path}" ]; then 
            echo "1"; 
        else 
            echo "0"; 
        fi`
  )
  return res === '1'
}

export const exec = (
  command: string,
  args: string[] = [],
  options: any = {}
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options })

    child.on('error', reject)

    child.on('exit', (code: number) => {
      if (code === 0) {
        resolve(code)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}
