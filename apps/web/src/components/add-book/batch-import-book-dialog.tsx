import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState, type ChangeEvent } from 'react';
import type { AddBookType } from '@repo/types';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useListCategory } from '#/hooks/use-category';
import { batchAddBookMutation } from '#/queries/book.query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ExcelBookRow = {
  ISBN: string;
  书名: string;
  作者: string;
  出版社: string;
  出版日期: string;
  分类: string;
  价格: string | number;
  库存: string | number;
  状态?: string;
};

export function BatchImportBookDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: categoryData } = useListCategory();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [previewRows, setPreviewRows] = useState<ExcelBookRow[]>([]);
  const [parsedRows, setParsedRows] = useState<AddBookType.AddBookRequest[]>(
    [],
  );
  const [parseError, setParseError] = useState('');
  const [importing, setImporting] = useState(false);
  const batchImportMutation = useMutation({
    ...batchAddBookMutation,
  });

  const resetState = () => {
    setFileName('');
    setPreviewRows([]);
    setParsedRows([]);
    setParseError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const mapRowsToBooks = (rows: ExcelBookRow[]) => {
    if (!categoryData) {
      throw new Error('分类数据还没加载完成');
    }

    const result: AddBookType.AddBookRequest[] = [];

    rows.forEach((row, index) => {
      const line = index + 2;
      const isbn = String(row.ISBN || '').trim();
      const title = String(row.书名 || '').trim();
      const author = String(row.作者 || '').trim();
      const publisher = String(row.出版社 || '').trim();
      const categoryName = String(row.分类 || '').trim();
      const publicationDateText = String(row.出版日期 || '').trim();
      const publicationDate = dayjs(publicationDateText).unix();
      const price = Number(row.价格 || 0);
      const total = Number(row.库存 || 0);
      const category = categoryData.find(
        (item) => item.name.trim() === categoryName,
      );

      const statusText = String(row.状态 || '在馆').trim();
      const status =
        statusText === '借出' ||
        statusText === '遗失' ||
        statusText === '损坏'
          ? statusText
          : '在馆';

      if (!isbn) {
        throw new Error(`第 ${line} 行缺少 ISBN`);
      }
      if (!title) {
        throw new Error(`第 ${line} 行缺少书名`);
      }
      if (!author) {
        throw new Error(`第 ${line} 行缺少作者`);
      }
      if (!publisher) {
        throw new Error(`第 ${line} 行缺少出版社`);
      }
      if (!publicationDateText || !dayjs(publicationDateText).isValid()) {
        throw new Error(`第 ${line} 行出版日期格式错误`);
      }
      if (!category) {
        throw new Error(`第 ${line} 行分类不存在`);
      }
      if (Number.isNaN(price) || price < 0) {
        throw new Error(`第 ${line} 行价格不合法`);
      }
      if (Number.isNaN(total) || total <= 0) {
        throw new Error(`第 ${line} 行库存必须大于 0`);
      }

      result.push({
        isbn,
        title,
        author,
        publisher,
        publicationDate,
        categoryId: category.id,
        price,
        total,
        status,
      });
    });

    return result;
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParseError('');
    setPreviewRows([]);
    setParsedRows([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        setParseError('Excel 文件没有可用工作表');
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const rows = XLSX.utils.sheet_to_json<ExcelBookRow>(worksheet, {
        raw: false,
        defval: '',
      });

      if (rows.length === 0) {
        setParseError('Excel 中没有可导入的数据');
        return;
      }

      setPreviewRows(rows);
      const mappedRows = mapRowsToBooks(rows);
      setParsedRows(mappedRows);
      console.log(mappedRows);
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : '解析 Excel 文件失败'
      );
    }
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) {
      toast.error('没有可导入的数据');
      return;
    }

    setImporting(true);

    try {
      const result = await batchImportMutation.mutateAsync({
        items: parsedRows,
      });

      toast.success(
        `成功导入 ${result.successCount} 条，失败 ${result.failureCount} 条`,
      );

      queryClient.invalidateQueries({
        queryKey: ['books'],
      });

      if (result.failureCount === 0) {
        resetState();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '批量导入失败');
    } finally {
      setImporting(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>批量导入图书</DialogTitle>
          <DialogDescription>
            请选择 Excel 文件，系统会先解析数据，再确认导入。
          </DialogDescription>
        </DialogHeader>
        <input
          ref={inputRef}
          type='file'
          accept='.xlsx,.xls'
          onChange={handleFileChange}
          className='hidden'
        />
        <div className='rounded-lg border border-dashed p-6 text-center'>
          <p className='text-sm text-muted-foreground'>
            支持 .xlsx / .xls 文件
          </p>

          <Button type='button' className='mt-4' onClick={handleChooseFile}>
            选择 Excel 文件
          </Button>
          {fileName ? (
            <p className='mt-3 text-sm text-muted-foreground'>
              已选择文件：{fileName}
            </p>
          ) : null}
          {parseError ? (
            <p className='mt-3 text-sm text-destructive'>{parseError}</p>
          ) : null}

          {previewRows.length > 0 ? (
            <p className='mt-3 text-sm text-muted-foreground'>
              已读取 {previewRows.length} 行，已转换 {parsedRows.length} 条记录
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              resetState();
              onOpenChange(false);
            }}
          >
            取消
          </Button>
          <Button
            type='button'
            onClick={handleImport}
            disabled={parsedRows.length === 0 || importing}
          >
            {importing ? '导入中...' : '确认导入'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
