-- Create time_entries table for clock in/out tracking
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5,2),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'clocked_in' CHECK (status IN ('clocked_in', 'clocked_out')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for time entries
CREATE POLICY "Employees can view their own time entries" 
ON public.time_entries 
FOR SELECT 
USING (true);

CREATE POLICY "Employees can create their own time entries" 
ON public.time_entries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Employees can update their own time entries" 
ON public.time_entries 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all time entries" 
ON public.time_entries 
FOR ALL
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_time_entries_updated_at
BEFORE UPDATE ON public.time_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate total hours
CREATE OR REPLACE FUNCTION public.calculate_total_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out_time IS NOT NULL AND NEW.clock_in_time IS NOT NULL THEN
    NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out_time - NEW.clock_in_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate hours
CREATE TRIGGER calculate_hours_trigger
BEFORE INSERT OR UPDATE ON public.time_entries
FOR EACH ROW
EXECUTE FUNCTION public.calculate_total_hours();

-- Enable realtime for time_entries
ALTER TABLE public.time_entries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.time_entries;