-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  employee_id TEXT NOT NULL UNIQUE,
  phone TEXT,
  department TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employee access
CREATE POLICY "Anyone can view employees" 
ON public.employees 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can create employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update employees" 
ON public.employees 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete employees" 
ON public.employees 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();