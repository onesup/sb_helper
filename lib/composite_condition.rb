class CompositeCondition
  
  def initialize(condition=nil)
    @conditions = Array.new
    add(condition) if condition
  end
  
  def add(condition)
    if condition.is_a?(Array)
      @conditions.push(condition) 
    elsif condition.is_a?(String)
      @conditions.push([condition]) 
    else
      raise "Unsupported #{condition.class} condition: #{condition}"
    end
    self
  end
  
  def conditions
    if @conditions.empty?
      nil
    else
      [@conditions.collect {|t| t[0]}.join(" and ")] + @conditions.inject([]) {|s, t| s += t[1..-1]}
    end
  end
  
  def <<(condition)
    add(condition)
  end
end
