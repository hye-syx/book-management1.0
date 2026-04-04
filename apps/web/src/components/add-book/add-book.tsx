import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function AddBookForm() {
  return (
    <div className=''>
      {/* <div className='flex justify-end mb-4'>
        <Button>返回</Button>
      </div> */}
      <Card className='w-full max-w-4xl'>
        <CardHeader>
          <CardAction>
            <Button>批量增加</Button>
          </CardAction>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <form>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='ISBN编码'>ISBN编码</Label>
                <Input
                  id={useId()}
                  type='text'
                  placeholder='请输入ISBN编码'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='书名'>书名</Label>
                <Input
                  id={useId()}
                  type='text'
                  placeholder='请输入书名'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='作者'>作者</Label>
                <Input
                  id={useId()}
                  type='text'
                  placeholder='请输入作者'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='出版社'>出版社</Label>
                <Input
                  id={useId()}
                  type='text'
                  placeholder='请输入出版社'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='出版日期'>出版日期</Label>
                <Input id={useId()} type='date' required />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='分类'>分类</Label>
                <Input
                  id={useId()}
                  type='text'
                  placeholder='请输入分类'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='价格'>价格</Label>
                <Input
                  id={useId()}
                  type='number'
                  placeholder='请输入价格'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='总数'>总数</Label>
                <Input
                  id={useId()}
                  type='number'
                  placeholder='请输入总数'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='可用数量'>可用数量</Label>
                <Input
                  id={useId()}
                  type='number'
                  placeholder='请输入可用数量'
                  required
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='状态'>状态</Label>
                <Select>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='选择书籍状态' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value='在馆'>在馆</SelectItem>
                      <SelectItem value='借出'>借出</SelectItem>
                      <SelectItem value='遗失'>遗失</SelectItem>
                      <SelectItem value='损坏'>损坏</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='w-full'>
            新增
          </Button>
          <Button variant='outline' className='w-full'>
            取消
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
